import CourseDropdown from '../commonComponenets/CourseDropdown'
import { useState } from 'react'
import ModuleDropdown from '../../dashboard/commonComponent/ModuleDropdown'
import SAssessments from './SAssessments'
import { userService } from '../../../servicer/UserService'

const CourseView = ({ onMessage, onLoad,onRefresh }) => {
    const [selectedModule, setSelectedModule] = useState('')
    const [moduleStatus, setModuleStatus] = useState(false)
    const [initStatus, setInitStatus] = useState(false)
    const [urlPath, setUrlPath] = useState('')
    const [urlStatus, setUrlStatus] = useState(false)
    const [dropCourse, setDropCourse] = useState('')
    const [assessment, setAssessment] = useState([])

    const selectedDropCourse = (c) => {
        console.log('selectedCourse', c)
        setDropCourse(c)
        console.log('slectedcor', dropCourse)
        setModuleStatus(false)
        setTimeout(function () {
            setModuleStatus(true)
        }, 500);
    }
    const selectedDropModule = (module) => {
        console.log(module)
        setSelectedModule(module)
        loadAssessment(module.id);
        setInitStatus(true)
    }
    const loadAssessment = (id) => {
        console.log('id', id)
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
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log('his')
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
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log('his')
    }
    const getCourdata = () => {
        let d = {
            course: dropCourse,
            module: selectedModule
        }
        console.log('sending data', d)
        return d;
    }
    const submitAssessment = (data) => {
        console.log('daaa', data)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat;
        let status = false
        headers.append("Authorization", btoken)
        headers.delete('Content-Type');
        const req = fetch('/api/submissions', {
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
            } else if (resStatus === 400 || resStatus === 500) {
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
            } else if (resStatus === 406) {
                let re = response.json();
                console.log('me', re)
                onMessage(re.message)
                return false
            }
        }).then(function (data) {
            if (data === false) {
                console.log('nothing')
                onLoad(false)
            } else {
                console.log('data', data)
                dat = data
                onLoad(false)
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log(status)
    }
    return (
        <div className='row'>
            <div className='col-12' style={{ overflow: 'auto' }}>
                <header className='header'>
                        <div className="col-2">
                            <h3>Course View</h3>
                        </div>
                        <div className="col-2">
                            <CourseDropdown onSelect={selectedDropCourse} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh} />
                        </div>
                        <div className="col-2">
                            {
                                moduleStatus &&
                                <ModuleDropdown course={dropCourse} onSelect={selectedDropModule} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh}/>
                            }
                        </div>
                        <div className='col-6'></div>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {
                        assessment.length > 0 ?
                            <SAssessments assessments={assessment} onClick={download}
                                onUpload={submitAssessment} onMessage={onMessage} course={getCourdata()} />
                            :
                            <div className='pCenter'>
                                <p>Nothing to show</p>
                            </div>
                    }
                </div>
            </div>
            <div className='col-4'>

            </div>
        </div>
    )
}

export default CourseView
