import { useState } from 'react'
import { userService } from '../../../servicer/UserService'
import React, { useEffect } from 'react'
import withAuth from "../../../servicer/withAuth";

const AddCourse = ({ onAdd, onUpdate, selectedData }) => {

    // useEffect(() => {
    //     console.log('hds', onUpdate
    //     // if(onUpdate) {
    //     //     console.log('hs')
    //     //     setCourseName(selectedData.courseName)
    //     //     setCourseDescription(selectedData.courseDescription)
    //     //     setStatus(selectedData.active)

    //     // }
    // }, []);

    const [courseName, setCourseName] = useState('')
    const [courseNameError, setCourseNameError] = useState('')
    const [courseDescription, setCourseDescription] = useState('')
    const [courseDescriptionError, setCourseDescriptionError] = useState('')
    const [status, setStatus] = useState(true)
    const [statusError, setStatusError] = useState(true)
    // console.log('update status', onUpdate())
    // console.log('update status', selectedData)
    // console.log('update status', selectedData.courseName);


    const onSubmit = (e) => {
        e.preventDefault()
        setCourseNameError('')
        setCourseDescriptionError('')
        setStatusError('')

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
        <div className='wrapper ' style={{margin:'85px 50px'}}>
            <h3 className="headingPara">Add Course</h3>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor="courseName">Course Name</label>
                    <input type='text' placeholder='Course Name' id="courseName"
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
                        <input type="submit" value="SAVE" className="btn btn-success btn-block" />
                }

            </form>
        </div>
    )
}

export default AddCourse
