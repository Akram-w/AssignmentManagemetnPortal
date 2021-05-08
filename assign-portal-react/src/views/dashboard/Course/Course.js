import React from 'react'

const Course = ({ onLoad, onUpdate }) => {
    return (
        <tr>
            <td>{onLoad.courseName}</td>
            <td>{onLoad.courseDescription}</td>
            <td>
                {
                    onLoad.active ?
                        <p style={{ color: 'green' }}>Active</p>
                        :
                        <p style={{ color: 'red' }}>Not-Active</p>
                }
            </td>
            <td>
                <button type='button' className='btn btn-primary'onClick={() => onUpdate(onLoad.id)}>Update</button>
            </td>
        </tr>
    )
}

export default Course
