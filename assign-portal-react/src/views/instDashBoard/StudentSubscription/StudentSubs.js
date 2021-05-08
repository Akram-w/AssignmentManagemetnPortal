import TutorUnderIns from './TutorsUnderIns'
import { useState } from 'react'
import CourseDrop from './CoursesUnderTutor'
import Subscriptions from './Subscriptions'
import { userService } from "../../../servicer/UserService";
const StudentSubs = ({ onMessage, onLoad,onRefresh }) => {

    const [tutor, setTutor] = useState('')
    const [course, setCourse] = useState({})
    const [subscriptions, setSubscriptions] = useState([])
    const [cStatus, setCStatus] = useState(false)
    const [tStatus, setTStatus] = useState(false)
    const [student, setStudent] = useState('')

    console.log("studdddd",subscriptions)
    const selectedDropStudent = (student) => {
        console.log('student', student)
        setStudent(student)
        // setSubscriptions([])
        console.log('st', student)
        setTStatus(false)
        loadSubsTable(student)
    }
    const selectedDropTutor = (tutor) => {
        console.log('tutor', tutor)
        setTutor(tutor)
        setCStatus(false)
        setTimeout(function () {
            setCStatus(true)
        }, 500);

    }
    const selectDropCourse = (course) => {
        console.log('course', course)
        setCourse(course)
    }
    const loadSubsTable = (student) => {
        //loading courses
        console.log('st', student)
        onLoad(true)
        setSubscriptions([])
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let status = false
        console.log('i dons')
        headers.append("Authorization", btoken)
        // let id=selectedCourse.id;
        let dat=[];
        let name = student.username
        const req = fetch('/api/subscriptions?studentName=' + name, {
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
                onMessage("Something went worng")
                return false;
            } else if (resStatus === 503) {
                onMessage('Service not available')
                return false
            } else if (resStatus === 401) {
                //refresh token
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);
            } else if (resStatus == 404) {
                onMessage("Something went wrong, we coul't find ")
                return false
            } else if(resStatus===403){
                onMessage("You don't have permission")
            }
        }).then(function (data) {
            if (data === false) {
                console.log('nothing')
                onLoad(false)
            } else {
                console.log('data', data)
                dat = [...data]
                onLoad(false)
                if (status) {
                    console.log('sh')
                    setSubscriptions(dat)
                    // filter(data)
                    setSubscriptions(dat)
                    // console.log('dat',subscriptions)
                    setTStatus(false)
                    setTStatus(true)
                    setTimeout(function () {
                        setTStatus(true)
                    }, 500);
                }
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log('his')

    }
    
    const addSub = () => {
        if (!course) {
            onMessage('Select course')
            return
        }
        if (!student) {
            onMessage('select student')
            return
        }
        if (!tutor) {
            onMessage('select tutor')
            return
        }
        console.log('accepted')
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
        // let id = tsubscription.id;
        // console.log(id)
        let subData = {
            studentName: student.username,
            courseId: course.id,
            accepted: true,
            banned: false
        }
        const req = fetch("/api/subscriptions", {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(subData),
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
            } else if (resStatus === 503) {
                onMessage('service not available')
                return false
            } else if (resStatus === 401) {
                //refresh token
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);
            } else if (resStatus === 404) {
                onMessage("couldn't find")
                return false
            } else if (resStatus == 406) {
                let re = response.json()
                console.log('re',re.message)
                onMessage("Already registered to this course")
                return false
            }
        }).then(function (data) {
            if (data === false) {
                onLoad(false)
                console.log('nothing')
            } else {
                console.log('data', data)
                onMessage('Subscription Added')
                // setSubscriptions([])
                let d={
                    coursesWithModule:{
                        course:course,
                        moduleList:null
                    },
                    subscription:data
                }
                setSubscriptions([...subscriptions,d])
                onLoad(false)
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log('his')
    }
    return (
        <div className='row'>
            <div className='col-12'>
                <header className='header'>
                    <div className='col-3'>
                        <h3>Subscription View</h3>
                    </div>
                    <div className='col-2'>
                        <TutorUnderIns onSelect={selectedDropStudent} onMessage={onMessage}
                            onLoad={onLoad} onType={true} onRefresh={onRefresh}/>
                    </div>
                    <div className='col-2'>
                        <TutorUnderIns onSelect={selectedDropTutor} onMessage={onMessage}
                            onLoad={onLoad} onType={false} onRefresh={onRefresh}/>
                    </div>
                    <div className='col-2'>
                        {
                            cStatus &&
                            <CourseDrop onSelect={selectDropCourse} onMessage={onMessage} onLoad={onLoad}
                                name={tutor.username} onRefresh={onRefresh} />
                        }
                    </div>
                    <div className='col-2'>
                        <div style={{marginTop:'16px'}}></div>
                        <button className="btn btn-success" onClick={() => addSub()}>Subscribe</button>
                    </div>
                    <div></div>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {
                        subscriptions.length > 0 ?
                            <Subscriptions subs={subscriptions} onMessage={onMessage} onLoad={onLoad} />
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

export default StudentSubs
