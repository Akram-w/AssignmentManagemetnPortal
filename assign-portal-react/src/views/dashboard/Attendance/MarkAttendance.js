
import CourseDropdown from '../commonComponent/CourseDropdown'
import Attendances from "./Attendances";
import { useState } from 'react'
import { userService } from "../../../servicer/UserService";
const MarkAttendance = ({ onMessage, onLoad ,onRefresh }) => {
    const [subscriptionStatus, setSubscriptionStatus] = useState(false)
    const [filteredList, setFilteredList] = useState([])
    const [dropStatus, setDropStatus] = useState(true)
    const selectedDropCourse = (course) => {
        console.log('data', course)
        setSubscriptionStatus(false)
        loadSubs(course)
    }
    const loadSubs = (course) => {
        //loading courses
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        console.log('i dons')
        headers.append("Authorization", btoken)
        let id = course.id;
        console.log(id)
        const req = fetch('/api/subscriptions?courseId=' + id, {
            method: 'GET',
            mode: 'cors',
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                status = true;
                return res
            } else if (resStatus === 400 || resStatus === 500) {
                console.log(response.statusText)
                onMessage("Something went wrong")
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

                if (status) {
                    console.log('sh')
                    filterData(data)
                }
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try again later")
            onLoad(false)
        })
        console.log('his')

    }
    const filterData = (data) => {
        if (data.subscription.length > 0) {
            console.log(data)
            let list = []
            data.subscription.forEach(element => {
                if (element.accepted) {
                    console.log("accepted")
                    if (!(element.banned)) {
                        console.log('banned')
                        list.push(getSavingData(element))
                    }
                }
            });
            setFilteredList([])
            setFilteredList(list)
            console.log('filter', filteredList)
            setSubscriptionStatus(true)
            onLoad(false)
        }
        onLoad(false)
    }
    const setAttended = (sub, status) => {
        console.log('sub', sub)
        console.log('status', status)
        setSubscriptionStatus(false)
        let f = {
            attendanceId: {
                studentName: sub.attendanceId.studentName,
                courseId: sub.attendanceId.courseId,
                attendingDate: sub.attendanceId.attendingDate
            },
            attended: status
        }
        console.log(f)
        setFilteredList(filteredList.map((item) => {
            if (item.attendanceId.studentName == sub.attendanceId.studentName) {
                if (item.attendanceId.courseId == sub.attendanceId.courseId) {
                    if (item.attendanceId.attendingDate == item.attendanceId.attendingDate) {
                        console.log('true')
                        return f
                    }
                }
            }
            return item
        }))
        setSubscriptionStatus(true)
        console.log("ins", filteredList)
    }
    const saveAttendance = () => {
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        console.log('i dons')
        headers.append("Authorization", btoken)
        headers.append("Content-Type", 'application/json')
        const req = fetch('/api/attendances?isList=true', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(filteredList),
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                status = true;
                return res
            } else if (resStatus === 400 || resStatus === 500) {
                console.log(response.statusText)
                response.text().then(text =>
                    onMessage(JSON.parse(text).error_description))
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

                if (status) {
                    console.log('sh')
                    setDropStatus(false)
                    setTimeout(function () {
                        setDropStatus(true)
                        setFilteredList([])
                        onLoad(false)
                    }, 1000);
                    onMessage('Attendance Marked')
                }
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try again later")
            onLoad(false)
        })
        console.log('his')
    }
    function pad(number, length){
        var str = "" + number
        while (str.length < length) {
            str = '0'+str
        }
        console.log('ss',str)
        return str
    }
    const getSavingData = (subs) => {
        let date = new Date();
        // 2021-02-08T12:00:10+05:30
        var zone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2]
        let day = date.getMonth() + 1;
        if (day < 10) {
            day = '0' + day;
        }
        console.log(day)
        let offset = new Date().getTimezoneOffset()
        let ftz = ((offset < 0 ? '+' : '-') + 
            pad(parseInt(Math.abs(offset / 60)), 2) +":"+
            pad(Math.abs(offset % 60), 2))
        let fd = date.getFullYear() + '-' + day + '-' + date.getDate() + 'T12:00:10' + ftz
        console.log('data', fd)
        let d = {
            attendanceId: {
                studentName: subs.studentName,
                courseId: subs.courseId,
                attendingDate: fd
            },
            attended: false
        }
        return d;
    }
    return (
        <div className='row'>
            <div className='col-12'>
                <header className='header'>
                    <div className='col-3'>
                        <h3>Mark Attendace</h3>
                    </div>
                    <div className='col-3'>
                        {
                            dropStatus &&
                            <CourseDropdown onSelect={selectedDropCourse} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh}/>
                        }
                    </div>
                    <div className='col-3'>
                        <button className="btn btn-success" onClick={() => saveAttendance()}>
                            SAVE ATTENDANCE</button>
                    </div>
                    <div>
                    </div>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {

                        subscriptionStatus ?
                            <Attendances subs={filteredList} onClick={setAttended} statusText={false} />
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

export default MarkAttendance
