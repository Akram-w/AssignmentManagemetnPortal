import { useState } from 'react'
import Users from './Users'
import { useEffect } from "react"
import { userService } from "../../../servicer/UserService";

const UsersUnderIns = ({ onMessage, onLoad,onRefresh}) => {
    useEffect(() => {
        loadData(false);
    }, []);
    const [data, setData] = useState([])

    const selected = (e) => {
        let id = e.target.value
        console.log('selectedId', id)
        if (id == 'student') {
            console.log('instu')
            loadData(true)
        } else if (id == 'tutor') {
            console.log('intu')
            loadData(false)
        }
    }
    const loadData = (statu) => {
        onLoad(true)
        setData([])
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let stat = false
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        let uType = statu ? 'student' : 'tutor'
        const req = fetch('/api/register/?instituteName=' + userName + "&userType=" + uType, {
            method: 'GET',
            mode: 'cors',
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                stat = true;
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
                if (stat) {
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
    return (
        <div className='row'>
            <div className='col-12'>
                <header className='header'>
                    <div className='col-3'>
                        <h3>View Users</h3>
                    </div>
                    <div className='col-2'>
                        <div className="form-group">
                            <label>Select User Type</label>
                            <select className='form-control' style={{ width: '180px' }} onChange={selected}>
                                <option selected='true' value="tutor">Tutor</option>
                                <option  value="student">Student</option>
                            </select>
                        </div>
                    </div>
                    <div className='col-7'></div>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {
                        data.length > 0 ?
                            <Users data={data} />
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

export default UsersUnderIns
