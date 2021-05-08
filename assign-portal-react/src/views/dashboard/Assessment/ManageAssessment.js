import ModuleDropdown from "../commonComponent/ModuleDropdown"
import CourseDropdown from "../commonComponent/CourseDropdown"
import AddAssessment from "./AddAssessment"
import Assessments from "./Assessments"
import { useState } from 'react'
import { userService } from '../../../servicer/UserService'
const ManageAssessment = ({ onMessage, onLoad, onRefresh }) => {
    const [assessment, setAssessment] = useState([])
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedModule, setSelectedModule] = useState('')
    const [moduleStatus, setModuleStatus] = useState(false)
    const [initStatus, setInitStatus] = useState(false)
    const [urlPath, setUrlPath] = useState('')
    const [urlStatus, setUrlStatus] = useState(false)
    console.log('module statu 11', moduleStatus)


    const selectedDropCourse = (course) => {
        console.log('this is course', course)
        // course.map((course)=>course.active)
        setSelectedCourse(course)
        setModuleStatus(false)
        setTimeout(function () {
            setModuleStatus(true)
            onLoad(false)
        }, 1000);
        // loadAssessment(course.id);
    }
    const selectedDropModule = (module) => {
        console.log(module)
        setSelectedModule(module)
        loadAssessment(module.id);
        setInitStatus(true)
    }
    const loadAssessment = (id) => {
        //loading courses
        onLoad(true)
        setAssessment([])
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        const req = fetch('/api/assessments/?modelId=' + id, {
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
                onMessage('Something went wrong')
                return false
            } else if (resStatus === 503) {
                onMessage('Service Unavailable');
                return false
            } else if (resStatus === 401) {
                //refresh token 
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);
            } else if (resStatus === 404) {
                onMessage("Unable to find")
                return false
            }
        }).then(function (data) {
            if (data === false) {
                console.log('nothing')
                onLoad(false)
            } else {
                console.log('data', data)
                console.log('datal', data.length)
                dat = [...data]
                onLoad(false)
                if (status) {
                    console.log('sh')
                    setAssessment(dat)
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

    const saveAssessment = (data) => {
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat;
        let status = false
        headers.append("Authorization", btoken)
        headers.delete('Content-Type');
        const req = fetch('/api/assessments', {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: data
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                status = true;
                return res
            } else if (resStatus === 400 || resStatus === 500 || resStatus === 406) {
                console.log(response.statusText)
                onMessage('something went wrong')
                return false
            } else if (resStatus === 503) {
                onMessage('Service Unavailable');
                return false
            } else if (resStatus === 401) {
                //refresh token 
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);
            } else if (resStatus === 404) {
                onMessage("Unable to find")
                return false
            } else if (resStatus === 405) {
                onMessage('date is not in correct format')
            } else if (resStatus === 406) {
                onMessage("couldn't find the attached file")
            }
        }).then(function (data) {
            if (data === false) {
                console.log('nothing')
                onLoad(false)
            } else {
                console.log('data', data)
                dat = data
                setAssessment([...assessment, data])
                console.log('dataaa', assessment)
                console.log('data', assessment.length)
                onLoad(false)
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try again later")
            onLoad(false)
        })
        console.log(status)
    }
    const download = (id) => {
        //loading courses
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        const req = fetch('/api/assessments/' + id + "/download", {
            method: 'GET',
            mode: 'cors',
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.text();
                return res
            } else if (resStatus === 400 || resStatus === 500) {
                console.log(response.statusText)
                onMessage("Something went wrong")
                return false;
            } else if (resStatus === 503) {
                onMessage('Service Unavailable');
                return false
            } else if (resStatus === 401) {
                //refresh token 
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);
            } else if (resStatus === 404) {
                onMessage("Unable to find")
                return false
            } else if (resStatus === 406) {
                onMessage("couldn't find the downloadable file")
                return false
            }
        }).then(function (data) {
            if (data === false) {
                onLoad(false)
                console.log('nothing')
            } else {
                onLoad(false)
                let d = window.open('+blank')
                d.location = data;
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try again later")
            onLoad(false)
        })
        console.log('his')
    }
    const getCourseWithModule = () => {
        let data = {
            course: selectedCourse,
            module: selectedModule
        }
        console.log('sle', data)
        return data
    }
    return (
        <div className='row'>
            <div className='col-8' style={{ overflow: 'auto' }}>
                <header className='header'>
                    <h3>Assessment Management</h3>
                    < CourseDropdown onSelect={selectedDropCourse} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh} />
                    {
                        moduleStatus &&
                        < ModuleDropdown course={selectedCourse} onSelect={selectedDropModule} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh}/>
                    }
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {
                        assessment.length > 0 ?
                            <Assessments assessments={assessment} onClick={download} />
                            :
                            <div className='pCenter'>
                                <p>Nothing to show</p>
                            </div>
                    }
                </div>
            </div>
            <div className='col-4'>
                {
                    <AddAssessment onAdd={saveAssessment} selectedData={getCourseWithModule} />
                }
            </div>
            {
                urlStatus && window.open(urlPath)
                // setUrlStatus(false)
            }

        </div>
    )
}

export default ManageAssessment
