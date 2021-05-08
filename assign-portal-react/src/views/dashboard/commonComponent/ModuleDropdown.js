import { useEffect } from "react"
import { userService } from "../../../servicer/UserService";
import { useState } from 'react'

function ModuleDropdown({ course, onSelect, onMessage, onLoad, onRefresh }) {
        useEffect(() => {
            // if(stat)
            console.log('inside init')
            loadCourses();
        }, []);
    console.log('on surface',course)
    // loadCourses()
    const [modules, setModules] = useState([])
    const [stat, setStat] = useState(false)
    const loadCourses = () => {
        //loading courses
        // onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        console.log('i dons')
        headers.append("Authorization", btoken)
        let courseId = course.id;
        const req = fetch('/api/modules/?courseId=' + courseId, {
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
                // onLoad(false)
                    onMessage('Something went wrong')
                return false;
            }else if (resStatus === 503) {
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
                // onLoad(false)
                if (status) {
                    console.log('sh')

                    let fdat = dat.filter((dat) => dat.active)
                    setModules(fdat)
                    setStat(true)
                }
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try agail later")
            // onLoad(false)
        })
        console.log('his')

    }
    const selected = (e) => {
        let id = e.target.value
        console.log('selectedId', id)
        let sCourse = modules.find((course) => course.id == id)
        onSelect(sCourse)
    }
    const getOption = () => {
        let item = [];
        modules.map(course => {
            console.log('this');
            item.push(<option key={course.id} value={course.id}>{course.moduleName}</option>)
        })
        return item
    }
    return (
        <select className='form-control' style={{ width: '180px' }} onChange={selected}>
            <option selected='true' disabled='disabled'>select Module</option>
            {/* {
                stat?'':
                loadCourses()
            } */}
            {
                stat &&
                modules.length > 0 ?
                    getOption()
                    :
                    <option disabled='disabled'>No Module to show</option>
            }
        </select>
    )
}

export default ModuleDropdown
