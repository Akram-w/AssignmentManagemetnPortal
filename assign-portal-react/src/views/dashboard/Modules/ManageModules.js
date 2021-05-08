import  CourseDropdown  from "../commonComponent/CourseDropdown";
import { useState } from 'react'
import  Modules  from "./Modules";
import  AddModules  from "./AddModules";
import  UpdateModules  from "./UpdateModules";
import  withAuth  from "../../../servicer/withAuth"
import { useEffect } from "react"
import  {userService}  from '../../../servicer/UserService'

function ManageModules({ onMessage, onLoad,onRefresh}) {
    useEffect(() => {
        console.log('iiiiiii')
        // loadCourses();
        setLoadStatus(true)
    }, []);
    const [modules, setModules] = useState([])
    const [selectedData, setSelectedData] = useState('')
    const [selectedCourse, setSelectedCourse] = useState('')
    const [updateStatus, setUpdateStatus] = useState(false)
    const [loadStatus, setLoadStatus] = useState(false)

    const selectedDropCourse = (course) => {
        setLoadStatus(false)
        console.log('insind dldo')
        console.log(course)
        setSelectedCourse(course)
        loadModules(course.id);
    }
    const loadModules = (id) => {
        //loading courses
        onLoad(true)
        setModules([])
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        const req = fetch('/api/modules/?courseId=' + id, {
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
               
                onMessage("Someting went wrong")
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
                console.log('nothing')
                onLoad(false)
            } else {
                console.log('data', data)
                console.log('datal', data.length)
                dat = [...data]
                onLoad(false)
                if (status) {
                    console.log('sh')
                    setModules(dat)
                    setUpdateStatus(false)
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
    const addModule = (data) => {
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat;
        let status = false
        headers.append("Authorization", btoken)
        headers.append("Content-Type", 'application/json')
        const req = fetch('/api/modules/', {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(data)
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
                console.log('nothing')
                onLoad(false)
            } else {
                console.log('data', data)
                dat = data
                if(data.active){
                    setModules([...modules, data])
                }
                
                console.log('dataaa', modules)
                console.log('data', modules.length)
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

    const updateModule = (data) => {
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat;
        let status = false
        console.log('inside update ',data)
        headers.append("Authorization", btoken)
        headers.append("Content-Type", 'application/json')
        const req = fetch('/api/modules/' + data.id, {
            method: 'PUT',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(data)
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                status = true;
                return res
            } else if (resStatus === 400 || resStatus === 500) {
                console.log(response.statusText)
                onMessage("Someting went wrong")
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
                console.log('nothing')
                onLoad(false)
            } else {
                console.log('data', data)
                dat = data
                
                    setModules(modules.map((task) => task.id == data.id ?
                    data : task))
                
                
                onLoad(false)
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try again later")
            onLoad(false)
            setUpdateStatus(false)
        })
    }
    const updateViewModuel = (id) => {
        let module = modules.find((module) => module.id == id)
        let data = {
            course: selectedCourse,
            module: module
        }
        setSelectedData(data)
        onLoad(true)
        setUpdateStatus(false)
        setTimeout(function () {
            setUpdateStatus(true)
            onLoad(false)
        }, 1000);
    }
    return (
        <div className='row'>
            <div className='col-8' style={{ overflow: 'auto' }}>
                <header className='header'>
                    <h3>Module Management</h3>
                    
                    <CourseDropdown onSelect={selectedDropCourse} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh} />
                    <button className='btn btn-primary'
                        onClick={() => setUpdateStatus(false)}>Add New Module</button>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {
                        modules.length > 0 ?
                            <Modules modules={modules} onUpdate={updateViewModuel} />
                            :
                            <div className='pCenter'>
                            <p>Nothing to show</p>
                            </div>
                    }
                </div>
            </div>
            <div className='col-4'>
                {
                    updateStatus ?
                        <UpdateModules onAdd={updateModule} onUpdate={updateStatus} selectedData={selectedData} />
                        :
                        <AddModules onAdd={addModule} onUpdate={updateStatus} selectedData={selectedCourse} />
                }
            </div>
        </div>
    )
}

export default ManageModules
