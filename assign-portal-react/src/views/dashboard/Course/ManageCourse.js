import AddCourse from './AddCourse'
import UpdateCourse from './UpdateCourse'
import { useState } from 'react'
import { userService } from '../../../servicer/UserService'
import React, { useEffect } from 'react';
import Courses from './Courses';
import withAuth from "../../../servicer/withAuth";

const ManageCourse = ({onMessage, onLoad, onRefresh}) => {
    useEffect(() => {
        loadCourses();
    }, []);
    // true means update
    const [updateStatus, setUpdateStatus] = useState(false)
    const [selectedData, setSelectedData] = useState('')
    const [courses, setCourses] = useState([])

    const loadCourses = () => {
        //loading courses
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        const req = fetch('/api/courses/?tutorName=' + userName, {
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
                console.log('datal', data.length)
                dat = [...data]
                onLoad(false)
                if (status) {
                    console.log('sh')
                    setCourses([...data])
                    console.log("end",courses)
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

    const addCourse = (data) => {
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat;
        let status = false
        headers.append("Authorization", btoken)
        headers.append("Content-Type", 'application/json')
        const req = fetch('/api/courses/', {
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
            } else if (resStatus === 400  || resStatus === 500) {
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
                onLoad(false)
                console.log('nothing')
            } else {
                console.log('data', data)
                dat = data
                setCourses([...courses, data])
                console.log('dataaa', courses)
                console.log('data', courses.length)
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
    const updateCourse = (data) => {
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat;
        let status = false
        headers.append("Authorization", btoken)
        headers.append("Content-Type", 'application/json')
        const req = fetch('/api/courses/' + data.id, {
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
                dat = data
                setCourses(courses.map((task) => task.id == data.id ?
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
    const viewAddCourse = (status) => {
        setUpdateStatus(status)
    }
    const updateViewCourse = (id) => {
        //and select the current item and pass it
        setSelectedData(courses.find((course) => course.id == id))
        console.log('hi', selectedData)
        onLoad(true)
        viewAddCourse(false)
        setTimeout(function () {
            viewAddCourse(true)
            onLoad(false)
        }, 1000);

    }
    const getUpdateStatus = () => {
        return updateStatus
    }
    return (
        <div className='row'>
            <div className='col-8' style={{ overflow: 'auto' }}>

                <header className='header'>
                    <h3>Course Management</h3>
                    <button className='btn btn-primary'
                        onClick={() => setUpdateStatus(false)}>Add New Course</button>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {
                        courses.length > 0 ?
                            <Courses courses={courses} onUpdate={updateViewCourse} />
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
                        <UpdateCourse onAdd={updateCourse} onUpdate={updateStatus} selectedData={selectedData} />
                        :
                        <AddCourse onAdd={addCourse} onUpdate={getUpdateStatus} selectedData={selectedData} />
                }
            </div>
        </div>
    )
}
export default ManageCourse
