import { useEffect } from "react"
import { useState } from 'react'
import { userService } from "../../../servicer/UserService";

const TutorsUnderIns = ({ onSelect, onMessage, onLoad, onType,onRefresh }) => {
    useEffect(() => {
        loadTutors();
    }, []);
    const [data, setData] = useState([])
    const loadTutors = () => {
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        let uType = onType ? 'student' : 'tutor'
        const req = fetch('/api/register/?instituteName=' + userName + "&userType=" + uType, {
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
            } else if (resStatus === 404) {
                onMessage("Something went wron courdn't Find")
                return false
            } else if (resStatus === 406) {
                let re = response.json()
                onMessage(re.message)
                return false
            } else if (resStatus === 401) {
                //unauthorized 
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);
            } else if (resStatus === 503) {
                onMessage("Service not available")
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
                    setData(dat)
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
        let sCourse = data.find((course) => course.id == id)
        console.log('hssi', sCourse)
        onSelect(sCourse)
    }
    const getOption = () => {
        let item = [];
        console.log('sosoe')
        data.map(course => {
            console.log('thisss');
            item.push(<option key={course.id} value={course.id}>{course.username}</option>)
        })
        return item
    }
    return (
        <div className="form-group">
            <label>{onType ? 'Select Student' : 'Select Tutor'}</label>
            <select className='form-control' style={{ width: '180px' }} onChange={selected}>
                <option selected='true' disabled='disabled'>select course</option>
                {
                    data.length > 0 ?
                        getOption()
                        :
                        <option>Nothing to show</option>
                }
            </select>
        </div>
    )
}

export default TutorsUnderIns
