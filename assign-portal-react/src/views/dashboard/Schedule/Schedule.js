import { useState, useEffect } from 'react'
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { userService } from '../../../servicer/UserService'
import 'react-big-calendar/lib/css/react-big-calendar.css';

// const EventCalendar = require('react-event-calendar');
const localizer = momentLocalizer(moment);
const Schedule = ({ onMessage, onLoad, role,onRefresh }) => {
    useEffect(() => {
        loadData();
    }, []);
    const [data, setData] = useState([])
    const getCurrentDate = () => {
        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
    const loadData = () => {
        onLoad(true)
        setData([])
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        let cdate = getCurrentDate()
        console.log(role)
        const req = fetch('/api/schedules/?currentDate=' + cdate + '&name=' + userName + '&role=' + role, {
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
                onMessage('try again later')
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
                    formateData(dat)
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
    const formateData = (data) => {
        console.log('dta', data)
        let d = []
        data.forEach(element => {
            let des=element.courseName + '-' + element.description+' \n From : '+element.startsAt+' \n To :'+element.endsAt
            let temp = {
                id: element.id,
                allDay: true,
                end: element.endsAt,
                start: element.startsAt,
                title: des,
            }
            d.push(temp)
        });
        console.log('formatted data', d)
        setData(d)
    }
    return (
        <div style={{ height: '100vh' }}>
            {data.length > 0 ?
                <Calendar
                    localizer={localizer}
                    events={data}
                    defaultDate={moment().toDate()}
                    defaultView="month"
                    startAccessor='start'
                    endAccessor='end'
                />
                :
                <div className='pCenter'>
                    <p>Nothing to show</p>
                </div>

            }

        </div>
    )
}
export default Schedule