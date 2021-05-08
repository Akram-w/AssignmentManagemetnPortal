import CourseDropdown from '../commonComponent/CourseDropdown'
import { useState } from 'react'
import { userService } from "../../../servicer/UserService";
import AttendanceDateDrop from './AttendanceDateDrop';
import Attendances from './Attendances'
function ViewAttendance({ onMessage, onLoad,onRefresh }) {
    const [dropStatus, setDropStatus] = useState(true)
    const [subscriptionStatus, setSubscriptionStatus] = useState(false)
    const [dateStatus, setDateStatus] = useState(false)
    const [course, setCourse] = useState('')
    const [filteredList, setFilteredList] = useState([])
    const selectedDropCourse = (course) => {
        console.log('data', course)
        setCourse(course)
        setDateStatus(false)
        setTimeout(function () {
            setDateStatus(true)
        }, 1000);
        
        setSubscriptionStatus(false)
        // loadAttendanceDates(course)
    }
    const selectedDate = (date) => {
        setSubscriptionStatus(false)
        console.log('selected Date',date)
        loadAttendances(date)
    }
    const loadAttendances=(date)=>{
        console.log('loadAtten',date)
        const courseId=course.id;
        console.log('id',courseId)
        //loading courses
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        setFilteredList([])
        let status = false
        headers.append("Authorization", btoken)
        const req = fetch('/api/attendances?courseId=' + courseId+'&date='+date, {
            method: 'GET',
            mode: 'cors',
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                status = true;
                return res
            } else if (resStatus === 400|| resStatus === 500) {
                console.log(response.statusText)
                onMessage("Something went wrong try again later")
                return false;
            }else if(resStatus===401){
                //resresh token
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);
            }else if(resStatus===404){
                onMessage("couldn't find")
                return false
            }else if(resStatus===503){
                onMessage('service unavailable try again later')
                return false
            }
        }).then(function (data) {
            if (data === false) {
                onLoad(false)
                console.log('nothing')
            } else {
                console.log('data', data)
                console.log('datal', data.length)
                dat = [...data]
                onLoad(false)
                if (status) {
                    console.log('sh',data)
                    setFilteredList(data)
                    setSubscriptionStatus(true)
                    console.log(data)
                }
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log('hissssss')

    }
    return (
        <div className='row'>
            <div className='col-12'>
                <header className='header'>
                    <div className='col-3'>
                        <h3>View Attendace</h3>
                    </div>
                    <div className='col-3'>
                        {
                            dropStatus &&
                            <CourseDropdown  onSelect={selectedDropCourse} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh} />
                        }
                    </div>
                    <div className='col-3'>
                        {
                            dateStatus &&
                            <AttendanceDateDrop data={course} onSelect={selectedDate} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh} />
                        }
                    </div>
                    <div>
                    </div>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {

                        subscriptionStatus ?
                            <Attendances subs={filteredList} onClick={null} status={true} />
                            :
                            <div className='pCenter'>
                                <p>Nothing to show</p>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ViewAttendance
