import { useEffect } from "react"
import { userService } from "../../../servicer/UserService";
import { useState } from 'react'

const CoursesUnderTutor = ({ onSelect, onMessage, onLoad, name,onRefresh }) => {
    useEffect(() => {
        console.log('hiiiiiiii')
        loadCourses();
    }, []);
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
        const req = fetch('/api/courses/?tutorName=' + name + "&status=true", {
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
            } else if (resStatus === 401) {
                //oauth refresh
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);
            } else if (resStatus === 503) {
                onMessage("Service not available")
                return false
            } else if (resStatus === 404) {
                onMessage("couldn't find")
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
        let sCourse = courses.find((course) => course.id == id)
        console.log('hssi', sCourse)
        onSelect(sCourse)
    }
    const getOption = () => {
        let item = [];
        console.log('sosoe')
        courses.map(course => {
            console.log('thisss');
            item.push(<option key={course.id} value={course.id}>{course.courseName}</option>)
        })
        return item
    }

    const [courses, setCourses] = useState([])
    return (
        <div className='form-group'>
            <label >Select Course</label>
            <select className='form-control' style={{ width: '180px' }} onChange={selected}>
                <option selected='true' disabled='disabled'>select course</option>
                {
                    courses.length > 0 ?
                        getOption()
                        :
                        <option>Nothing to show</option>
                }
            </select>
        </div>
    )
}

export default CoursesUnderTutor
