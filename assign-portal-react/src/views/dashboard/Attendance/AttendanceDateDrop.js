import { useEffect } from "react"
import { userService } from "../../../servicer/UserService";
import { useState } from 'react'
const AttendanceDateDrop = ({ data,onSelect, onMessage, onLoad,onRefresh }) => {
    useEffect(() => {
        console.log('hiiiiiiii')
        loadData();

    }, []);
    const [dates, setDates] = useState([])
    const loadData = () => {
        //loading courses
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        headers.append("Authorization", btoken)
        let id = data.id
        const req = fetch('/api/attendances/dates?courseId=' + id, {
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
                response.text().then(text =>
                    onMessage(JSON.parse(text).error_description))
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
                    setDates(dat)
                    console.log(data)
                }
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try again later")
            onLoad(false)
        })
        console.log('hissssss')

    }
    const selected = (e) => {
        console.log('sle', e)
        let value = e.target.value
        console.log('selectedId', value)
        let fDate = dates.find((course) => course == value)
        console.log('hssi', fDate)
        onSelect(fDate)
    }
    const getOption = () => {
        let item = [];
        console.log('sosoe')
        dates.map(date => {
            console.log('thisss');
            item.push(<option key={date} value={date}>{date}</option>)
        })
        return item
    }
    return (
        <select className='form-control' style={{ width: '180px' }} onChange={selected}>
            <option selected='true' disabled='disabled'>select Date</option>
            {
                dates.length > 0 ?
                    getOption()
                    :
                    <option>Nothing to show</option>
            }
        </select>
    )
}

export default AttendanceDateDrop
