import Navigationbar from "./navigation/Navigationbar";
import 'bootstrap/dist/css/bootstrap.css'
import ManageCourse from "./Course/ManageCourse";
import ManageModules from './Modules/ManageModules'
import ManageAssessment from './Assessment/ManageAssessment'
import ManageSubmission from './Submisson/ManageSubmission'
import ManageSubscription from './Subscription/ManageSubscription'
import MarkAttendance from "./Attendance/MarkAttendance";
import ViewAttendace from "./Attendance/ViewAttendance";
import AddSchedule from "./Schedule/AddSchedule";
import CourseView from "../studentDashboard/CourseView/CourseView"
import StudentSubs from "../instDashBoard/StudentSubscription/StudentSubs"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import RegisterS from "../instDashBoard/RegisterStudent";
import RegisterT from "../instDashBoard/RegisterTutor";
import UserView from '../instDashBoard/RegisteredList/UsersUnderIns'
import ViewSchedule from './Schedule/Schedule'
import withAuth from "../../servicer/withAuth"
import ChangePassword from "./ChangePassword/PasswordChanger";
import { useState } from 'react'
import {useEffect} from 'react'
import {userService} from '../../servicer/UserService'



const Dashboard = ({ load, loggedOut, onMessage, onRegister, onRefresh}) => {

    const [endPath, setEndPath] = useState('')

    useEffect(()=>{
        let user=new userService();
        let type=user.getUserType();
        if(type=='student'){
            setEndPath('Course-View')
        }else if(type=='tutor'){
            setEndPath('Manage-Courses')
        }else{
            setEndPath('Sregister')
        }
    },[]);

    const setChangePath = (p) => {
        setEndPath(null)
        console.log('path nullll')
        setTimeout(()=>{
            setEndPath(p)
            console.log('setENd', p)
        },500); 
    }
    return (
        <Router>
            <Navigationbar loggedOut={loggedOut} endPath={setChangePath} />
            <div className="container-fluid">
                
                {
                    endPath === 'Manage-Courses' && <ManageCourse onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>

                }
                {
                    endPath === 'Manage-Modules' && <ManageModules onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'Manage-Assessments' && <ManageAssessment onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'Submissions' && <ManageSubmission onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'Subscriptions' && <ManageSubscription onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'Mark-Attendance' && <MarkAttendance onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'View-Attendance' && <ViewAttendace onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'Add-Schedule' && <AddSchedule onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'Course-View' && <CourseView onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'Student-Subscriptions' && <StudentSubs onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'Sregister' && <RegisterS onAdd={onRegister} onMessage={onMessage} onLoad={load}/>
                }
                {
                    endPath === 'Tregister' && <RegisterT onAdd={onRegister} onMessage={onMessage} onLoad={load}/>
                }
                {
                    endPath === 'UserView' && <UserView onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
                {
                    endPath === 'View-ScheduleT' && <ViewSchedule onMessage={onMessage} onLoad={load} role='tutor' onRefresh={onRefresh}/>
                }
                {
                    endPath === 'View-ScheduleS' && <ViewSchedule onMessage={onMessage} onLoad={load} role='student' onRefresh={onRefresh}/>
                }
                {
                    endPath === 'changePassword' && <ChangePassword onMessage={onMessage} onLoad={load} onRefresh={onRefresh}/>
                }
            </div>
        </Router>
    )
}

export default Dashboard
