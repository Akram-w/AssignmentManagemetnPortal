import CourseDropdown from "../commonComponent/CourseDropdown"
import { useState } from 'react'
import { userService } from "../../../servicer/UserService";
import Subscriptions from "./Subscriptions"

const ManageSubscription = ({ onMessage, onLoad,onRefresh}) => {
    const [course, setCourse] = useState('')
    const [subscripton, setSubscription] = useState(null)
    const [filteredList, setFilteredList] = useState([])
    const [subscriptionStatus, setSubscriptionStatus] = useState(false)
    const [selectedOption, setSelectedOption] = useState(false)

    const selectedDropCourse = (course) => {
        console.log('this is course', course)
        // course.map((course)=>course.active)
        // setSelectedCourse('')
        setCourse(course)
        console.log(course.id)
        console.log(course)
        loadSubscriptions(course.id)
    }
    const viewStatus = (e) => {
        let status = e.target.value
        console.log('selectedId', status)
        if (status == 'not_accept') {
            console.log('drop not accepted')
            setSelectedOption(false)
        } else {
            console.log('drop accepted')
            setSelectedOption(true)
        }
        console.log(selectedOption)
        filterData(subscripton)
    }
    const loadSubscriptions = (id) => {
        //loading courses
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        console.log('i dons')
        headers.append("Authorization", btoken)
        // let id=selectedCourse.id;
        console.log(id)
        const req = fetch('/api/subscriptions?courseId=' + id, {
            method: 'GET',
            mode: 'cors',
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                status = true;
                return res
            } else if (resStatus === 400|| resStatus === 500) {
                console.log(response.statusText)
                onMessage("Something went wrong try again later")
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
                // dat = [...data]
                onLoad(false)
                if (status) {
                    console.log('sh')
                    setSubscription(data)
                    filterData(data)
                }
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log('his')

    }
    const filterData = (data) => {
        console.log('slec', selectedOption)
        let fil;
        if (!subscripton) {

        } else {
            setFilteredList([])
            if (!selectedOption) {
                setFilteredList(data.subscription.filter((sub) => sub.accepted))
                console.log('accept', filteredList)
            } else {
                setFilteredList(data.subscription.filter((sub) => !(sub.accepted)))
                console.log('not', filteredList)
            }
        }
        console.log('filet', filteredList)
        setSubscriptionStatus(true)
        // setTimeout(function () {
        //     setSubscriptionStatus(true)
        //     onLoad(false)
        // }, 500);
        console.log(data)
    }
    const accept = (subscription) => {
        console.log('accepted')
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        console.log('i dons')
        headers.append("Authorization", btoken)
        let id=subscription.id;
        console.log(id)
        const req = fetch("/api/subscriptions/"+id+'?accepted='+true, {
            method: 'PUT',
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
                onMessage("UserAccepted")
                setFilteredList(filteredList.map((sub) => sub.id == data.id ?
                    data : sub))
                    onLoad(false)
                // filterData(subscription)
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log('his')
    }
    const setBann = (subscription) => {
        console.log('banned')
        console.log('sb', subscription)
        let status=!(subscription.banned)
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        // let status = false
        console.log('i dons')
        headers.append("Authorization", btoken)
        let id=subscription.id;
        console.log(id)
        const req = fetch("/api/subscriptions/"+id+'?banned='+status, {
            method: 'PUT',
            mode: 'cors',
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                // status = true;
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
                data.banned?
                onMessage("User Banned")
                :
                onMessage("User unBanned")
                setFilteredList(filteredList.map((sub) => sub.id == data.id ?
                    data : sub))
                    onLoad(false)
                // filterData(subscription)
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try agail later")
            onLoad(false)
        })
        console.log('his')
    }
    return (
        <div className='row'>
            <div className='col-12'>
                <header className='header'>
                    <div className='col-3'>
                        <h3>Subscription View</h3>
                    </div>
                    <div className='col-3'>
                        <CourseDropdown onSelect={selectedDropCourse} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh}/>
                    </div>
                    <div className='col-2'>
                        <select className='form-control' onChange={viewStatus}>
                            <option value='not_accept'>Not_Accepted</option>
                            <option value='accept'>Accepted</option>
                        </select>
                    </div>
                    <div>
                    </div>
                </header>
                <div className='row' style={{ padding: '10px' }}>
                    {

                        subscriptionStatus ?
                            // filteredList > 0 ?
                                <Subscriptions subs={filteredList} onAccept={accept} onClick={setBann} />
                                :
                                <div className='pCenter'>
                                    <p>Nothing to show</p>
                                </div>
                            // :
                            // <div className='pCenter'>
                            //     <p>Nothing to show</p>
                            // </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ManageSubscription
