import { useEffect } from "react"
import { userService } from "../../../servicer/UserService";
import { useState } from 'react'
const CourseDropdown = ({ onSelect, onMessage, onLoad,onRefresh }) => {
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
        const req = fetch('/api/courses/?tutorName=' + userName + "&status=true", {
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
        console.log('sle',e)
        let id = e.target.value
        console.log('selectedId', id)
        let sCourse = courses.find((course) => course.id == id)
        console.log('hssi',sCourse)
        onSelect(sCourse)
    }
    const getOption=()=>{
        let item=[];
        console.log('sosoe')
        courses.map(course => {
            if(!course){}
            console.log('thisss');
            item.push(<option key={course.id} value={course.id}>{course.courseName}</option>)
        })
        return item
    }
    return (
        // <div className="dropdown">
        // <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">Courses
        // <span className="caret"></span></button>
        <select className='form-control' style={{width:'180px'}} onChange={selected}>
            <option selected='true' disabled='disabled'>select course</option>
            {
                courses.length > 0 ?
                        getOption()
                    :
                    <option>Nothing to show</option>
            }
        </select>
    )
}

export default CourseDropdown
