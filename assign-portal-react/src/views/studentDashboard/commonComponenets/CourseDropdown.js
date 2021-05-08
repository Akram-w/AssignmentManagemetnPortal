import { useEffect } from "react"
import { userService } from "../../../servicer/UserService";
import { useState } from 'react'

const CourseDropdown = ({ onSelect, onMessage, onLoad, onRefresh }) => {
    useEffect(() => {
        console.log('hiiiiiiii')
        if (stat) {
            loadCourses();
            setStat(false)
        }
    }, []);
    const [courses, setCourses] = useState([])
    const [stat, setStat] = useState(true)

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
        const req = fetch('/api/subscriptions/?studentName=' + userName, {
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
                console.log('nothing')
                onLoad(false)
            } else {
                console.log('data', data)
                console.log('datal', data.length)
                dat = [...data]
                onLoad(false)
                if (status) {
                    console.log('sh')
                    setCourses(dat)
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
    const selected = (e) => {
        console.log('sle', e)
        let id = e.target.value
        console.log('selectedId', id)
        let sCourse = courses.find((course) => course.coursesWithModule.course.id == id)
        console.log('hssi', sCourse.coursesWithModule.course)
        onSelect(sCourse.coursesWithModule.course)
    }
    const getOption = () => {
        let item = [];
        console.log('sosoe', courses)
        courses.map(course => {
            console.log('thisss');
            if (course.subscription.accepted) {
                console.log('first in')
                if (!(course.subscription.banned)) {
                    console.log('sec in')
                    if (course.coursesWithModule != null) {
                        item.push(<option key={course.coursesWithModule.course.id} value={course.coursesWithModule.course.id}>
                            {course.coursesWithModule.course.courseName}</option>)
                    } else {
                        onMessage('Something went wrong try again later')
                        return
                    }

                }
            }
        })
        return item
    }
    const getK=()=>{
        console.log('============================================')
    }
    return (
        <select className='form-control' style={{ width: '180px' }} onChange={selected}>
            <option selected='true' disabled='disabled'>select course</option>
            {
                courses.length > 0 ?
                    getOption()
                    :
                    <option>Nothing to show</option>
            }
            {
                courses.length > 0 ?
                    getK()
                    :
                    ''
            }
        </select>



    )
}

export default CourseDropdown
