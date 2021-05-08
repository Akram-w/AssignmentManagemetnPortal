import React from 'react'

const Subscription = ({ data }) => {
    return (
        <tr>
            <td>{data.subscription.studentName}</td>
            <td>{data.coursesWithModule.course.courseName}</td>
            <td>
                {
                    data.subscription.accepted ?
                        <p style={{ color: 'green' }}>Accepted</p>
                        :
                        <p style={{ color: 'red' }}>Not Acceped</p>
                }
            </td>
            <td>
                {
                    data.subscription.banned ?
                        <p style={{ color: 'red' }}>Banned</p>
                        :
                        <p style={{ color: 'green' }}>Not Banned</p>
                }
            </td>
        </tr>
    )
}

export default Subscription
