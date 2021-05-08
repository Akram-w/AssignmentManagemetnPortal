import { useEffect } from "react"
import { userService } from "../../../servicer/UserService";
import { useState } from 'react'

function AssessmentDropdown({ module, onSelect, onMessage, onLoad,onRefresh }) {

    useEffect(() => {
        // if(stat)
        console.log('inside init')
        loadAssessments(module.id);
    }, []);

    console.log('on surface')
    // loadCourses()
    const [assessment, setAssessment] = useState([])
    const [stat, setStat] = useState(false)

    const loadAssessments = (id) => {
        //loading courses
        onLoad(true)
        setAssessment([])
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let dat = [];
        let status = false
        headers.append("Authorization", btoken)
        let userName = user.getUserName();
        const req = fetch('/api/assessments/?modelId=' + id, {
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
                onMessage("something went wrong try again later")
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
                onMessage('service unavailable try agail later')
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
                    setAssessment(data)
                    setStat(true)
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
    const selected = (e) => {
        let id = e.target.value
        console.log('selectedId', id)
        let sCourse = assessment.find((course) => course.id == id)
        onSelect(sCourse)
    }
    const getOption = () => {
        let item = [];
        assessment.map(course => {
            console.log('this');
            item.push(<option key={course.id} value={course.id}>{course.assessmentName}</option>)
        })
        return item
    }
    return (
        <select className='form-control' style={{ width: '180px' }} onChange={selected}>
        <option selected='true' disabled='disabled'>select Assessemnt</option>
        {/* {
            stat?'':
            loadCourses()
        } */}
        {
            stat &&
            assessment.length > 0 ?
                getOption()
                :
                <option disabled='disabled'>No Module to show</option>
        }
    </select>
    )
}

export default AssessmentDropdown
