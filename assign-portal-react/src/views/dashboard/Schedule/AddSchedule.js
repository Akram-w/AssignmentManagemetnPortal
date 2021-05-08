import Course from '../commonComponent/CourseDropdown'
import { useState } from 'react'
import { userService } from '../../../servicer/UserService'

const AddSchedule = ({ onMessage, onLoad, onRefresh }) => {
    const [course, setCourse] = useState('')
    const [courseError, setCourseError] = useState('')
    const [scheduleDescription, setScheduleDescription] = useState('')
    const [scheduleDescriptionError, setScheduleDescriptionError] = useState('')
    const [startDate, setStartDate] = useState('')
    const [startDateError, setStartDateError] = useState('')
    const [startTime, setStartTime] = useState('')
    const [startTimeError, setStartTimeError] = useState('')
    const [endDate, setEndDate] = useState('')
    const [endDateError, setEndDateError] = useState('')
    const [endTime, setEndTime] = useState('')
    const [endTimeError, setEndTimeError] = useState('')

    const selectedCourseDrop = (course) => {
        setCourse(course)

    }

    const onSubmit = (e) => {
        e.preventDefault()
        setCourseError('')
        setScheduleDescriptionError('')
        setStartDateError('')
        setStartTimeError('')
        setEndDateError('')
        setEndTimeError('')

        if (!course) {
            setCourseError('select a course')
            return
        }
        if (!scheduleDescription) {
            setScheduleDescriptionError('Add description to course')
            return
        }
        if (!startDate) {
            setStartDateError('select startDate')
            return
        }
        if (!startTime) {
            setStartTimeError('select startTime')
            return
        }
        if (!endDate) {
            setEndDateError('select endDate')
            return
        }
        if (!endTime) {
            setEndTimeError('select endTime')
            return
        }
        if (startDate > endDate) {
            setEndDateError("End Date can't be previous date")
            return
        }

        console.log(course)
        console.log(scheduleDescription)
        console.log(startDate)
        console.log(startTime)
        console.log(endDate)
        console.log(endTime)
        // 2007-12-03T10:15:30
        let start = startDate + 'T' + startTime + ':00'
        let end = endDate + 'T' + endTime + ':00'
        let d = {
            courseId: course.id,
            courseName: course.courseName,
            description: scheduleDescription,
            startsAt: start,
            endsAt: end
        }
        save(d)

    }
    const save = (data) => {
        onLoad(true)
        let user = new userService();
        let token = user.getToken()

        const headers = new Headers();
        let btoken = 'Bearer ' + token
        headers.append("Authorization", btoken)
        headers.append("Content-Type", "application/json")
        const req = fetch('/api/schedules/', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data),
            headers: headers,
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                return res
            } else if (resStatus === 400 || resStatus === 500) {
                console.log(response.statusText)
                onMessage("Something went wrong")
                return false;
            } else if (resStatus === 406) {
                let ms = response.json().message
                onMessage(ms)
                return false;
            } else if (resStatus === 404) {
                onMessage("couldn't find try again later")
                return false;
            } else if (resStatus === 401) {
                //resresh token
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)

                }, 2000);
                return false
            } else if (resStatus === 503) {
                onMessage('service unavailable try again later')
                return false
            } else {
                onMessage('something went wrong')
                return false
            }
        }).then(function (data) {
            if (data === false) {
                onLoad(false)
                console.log('nothing')
            } else {
                onLoad(false)
                setScheduleDescription('')
                setStartDate('')
                setStartTime('')
                setEndDate('')
                setEndTime('')
                onMessage('Schedule Added')
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            onMessage("Something went wrong try again later")
            onLoad(false)
        })
        console.log('his')
    }
    return (
        <div className="loginwrapper">
            <h3 className="headingPara">Add Schedule</h3>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor="course">Select Course</label>
                    <Course onSelect={selectedCourseDrop} onMessage={onMessage} onLoad={onLoad} onRefresh={onRefresh} />
                    <p className="formError">{courseError}</p>
                </div>
                <div className='form-group'>
                    <label htmlFor="scDesc">Schedule Description</label>
                    <textarea type='textarea' placeholder='Description' id="scDesc"
                        value={scheduleDescription}
                        className="form-control"
                        onChange={(e) => setScheduleDescription(e.target.value)} />
                    <p className="formError">{scheduleDescriptionError}</p>
                </div>
                <div className='form-group row'>
                    <div className="col-6">
                        <label htmlFor="chooseStartDate">Choose Start Date</label>
                        <input type='date' placeholder='Start Date' id="chooseStartDate"
                            value={startDate}
                            className="form-control"
                            onChange={(e) => setStartDate(e.target.value)} />
                        <p className="formError">{startDateError}</p>
                    </div>
                    <div className="col-6">
                        <label htmlFor="chooseStartTime">Choose Start Time</label>
                        <input type='time' placeholder='Start Time' id="chooseStartTime"
                            value={startTime}
                            className="form-control"
                            onChange={(e) => setStartTime(e.target.value)} />
                        <p className="formError">{startTimeError}</p>
                    </div>
                </div>
                <div className='form-group row'>
                    <div className="col-6">
                        <label htmlFor="chooseEndtDate">Choose End Date</label>
                        <input type='date' placeholder='End Date' id="chooseEndDate"
                            value={endDate}
                            className="form-control"
                            onChange={(e) => setEndDate(e.target.value)} />
                        <p className="formError">{endDateError}</p>
                    </div>
                    <div className="col-6">
                        <label htmlFor="chooseEndtTime">Choose End Time</label>
                        <input type='time' placeholder='End Time' id="chooseEndTime"
                            value={endTime}
                            className="form-control"
                            onChange={(e) => setEndTime(e.target.value)} />
                        <p className="formError">{endTimeError}</p>
                    </div>
                </div>
                <input type="submit" value="SAVE" className="btn btn-success btn-block" />
            </form>
        </div>
    )
}

export default AddSchedule
