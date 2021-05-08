
import { useState } from 'react'
import CourseDropdown from "../commonComponent/CourseDropdown";
import ModuleDropdown from "../commonComponent/ModuleDropdown"
import AssessmentDropdown from "../commonComponent/AssessmentDropdown"
import { userService } from "../../../servicer/UserService";
import Submissions from "./Submissions"

const ManageSubmission = ({ onMessage, onLoad,onRefresh }) => {
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedModule, setSelectedModule] = useState('')
    const [loadStatus, setLoadStatus] = useState(false)
    const [moduleStatus, setModuleStatus] = useState(false)
    const [submission, setSubmission] = useState([])
    const [assessStatus, setAssessStatus] = useState(false)
    const [assessTableStat,setAssessTableStat]= useState(false)
    const selectedDropCourse = (course) => {
        console.log('this is course', course)
        // course.map((course)=>course.active)
        setSelectedCourse(course)
        setModuleStatus(false)
        setTimeout(function () {
            setModuleStatus(true)
            onLoad(false)
        }, 1000);
    }

    const selectedDropModule = (module) => {
        console.log(module)
        setSelectedModule(module)
        setAssessStatus(false)
        setTimeout(function () {
            setAssessStatus(true)
            onLoad(false)
        }, 1000);
        // loadSubmission(module.id);
    }
    const selectedDropAssess = (assessment) => {
        console.log('assessment', assessment)
        loadSubmission(assessment.id)
    }
    const loadSubmission = (id) => {
        console.log('loadsubmission', id)
        //loading courses
        onLoad(true)
        setSubmission([])
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        const req = fetch('/api/submissions/?assessmentId=' + id, {
            method: 'GET',
            mode: 'cors',
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                status = true;
                return res
            } else if (resStatus === 400  || resStatus === 500) {
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
                console.log('datal', data.length)
                dat = [...data]
                onLoad(false)
                if (status) {
                    console.log('sh')
                    setSubmission(data)
                    setAssessTableStat(true)
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
    const download = (id) => {
        console.log('downloa', id)
         //loading courses
         onLoad(true)
         let user = new userService();
         let token = user.getToken()
 
         const headers = new Headers();
         let btoken = 'Bearer ' + token
         headers.append("Authorization", btoken)
         let userName = user.getUserName();
         const req = fetch('/api/submissions/' + id + "/download", {
             method: 'GET',
             mode: 'cors',
             headers: headers,
         }).then(response => {
             let resStatus = response.status;
             if (resStatus === 200) {
                 let res = response.text();
                 return res
             } else if (resStatus === 400  || resStatus === 500) {
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
                 onLoad(false)
                 let d=window.open( '+blank')
                d.location=data;
             }
         }).catch(error => {
             console.log("error :", error);
             console.log("error code :", error);
             onMessage("Something went wrong try again later")
             onLoad(false)
         })
         console.log('his')
    }
    return (
        <div className='row'>
            <div className='col-12'>
                <header className='header'>
                    <div className='col-3'>
                        <h3>Submission View</h3>
                    </div>
                    <div className='col-3'>
                        <CourseDropdown onSelect={selectedDropCourse} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh}/>
                    </div>
                    <div className='col-3'>
                        {
                            moduleStatus &&
                            < ModuleDropdown course={selectedCourse} onSelect={selectedDropModule} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh}/>
                        }
                    </div>
                    <div className='col-3'>
                        {
                            assessStatus &&
                            <AssessmentDropdown module={selectedModule} onSelect={selectedDropAssess} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh}/>
                        }
                    </div>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {

                        submission.length > 0 ?
                            <Submissions submission={submission} onClick={download} />
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

export default ManageSubmission
