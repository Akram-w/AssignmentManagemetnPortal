import { useState } from 'react'
import { userService } from '../../../servicer/UserService'
import React, { useEffect } from 'react'
import withAuth from "../../../servicer/withAuth";

const UpdateCourse = ({ onAdd, onUpdate, selectedData }) => {

    useEffect(() => {
        console.log('hds', onUpdate)
        if(onUpdate) {
            console.log('hs')
            setCourseName(selectedData.courseName)
            setCourseDescription(selectedData.courseDescription)
            setStatus(selectedData.active)

        }
    }, []);

    const [courseName, setCourseName] = useState(selectedData.courseName)
    const [courseNameError, setCourseNameError] = useState('')
    const [courseDescription, setCourseDescription] = useState(selectedData.courseDescription)
    const [courseDescriptionError, setCourseDescriptionError] = useState('')
    const [status, setStatus] = useState(selectedData.active)
    const [statusError, setStatusError] = useState(true)
    console.log('update status', onUpdate)
    console.log('update status', selectedData)
    console.log('update status', selectedData.courseName);
    // load()
    var load=()=>{
        console.log('hiiiiiiiii')
    }
    const onSubmit = (e) => {
        e.preventDefault()
        setCourseNameError('')
        setCourseDescriptionError('')
        setStatusError('')
        console.log(courseName)
        if (!courseName) {
            setCourseNameError('Course Name is empty')
            return
        }
        if (!courseDescription) {
            setCourseDescriptionError('Course Description is empty')
            return
        }
        let user = new userService()
        let userName = user.getUserName();
        if (onUpdate) {
            let data = {
                id: selectedData.id,
                courseName: courseName,
                courseDescription: courseDescription,
                tutorName: selectedData.tutorName,
                active: status
            }
            onAdd(data)
        } else {
            let data = {
                courseName: courseName,
                courseDescription: courseDescription,
                tutorName: userName,
                active: status
            }
            onAdd(data)
        }

        setCourseName('')
        setCourseDescription('')
        setStatus(false)
    }
    return (
        <div className='wrapper 'style={{margin:'85px 50px'}}>
            <h3 className="headingPara">Updates Courses</h3>
            <form onSubmit={onSubmit} >
                <div className='form-group'>
                    <label htmlFor="courseName">Course Name</label>
                    <input type='text'  placeholder='Course Name' id="courseName"
                        value={courseName}
                        className="form-control"
                        onChange={(e) => setCourseName(e.target.value)} />
                    <p className="formError">{courseNameError}</p>
                </div>
                <div className='form-group'>
                    <label htmlFor="courseName">Course Description</label>
                    <textarea type='textarea' placeholder='Description' id="courseDescription"
                        value={courseDescription}
                        className="form-control"
                        onChange={(e) => setCourseDescription(e.target.value)} />
                    <p className="formError">{courseDescriptionError}</p>
                </div>
                <div className='form-control-check'>
                    <label>Status</label>
                    <input type='checkbox'
                        checked={status}
                        value={status}
                        onChange={(e) => setStatus(e.currentTarget.checked)} />
                </div>
                {

                    onUpdate ?
                        <input type="submit" value="UPDATE" className="btn btn-success btn-block" />
                        :
                        <input type="submit" value="SAVE" className="btn btn-success btn-block" />
                }

            </form>
        </div>
    )
}

export default UpdateCourse
