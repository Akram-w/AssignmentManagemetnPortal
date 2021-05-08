import React from 'react'
const Subscription = ({ onLoad, onAccept, onClick }) => {

    return (
        <tr>
            {console.log('tables', onLoad)}
            <td>{onLoad.studentName}</td>
            <td>
                {
                    onLoad.accepted ?
                        <p style={{ color: 'green' }}>'Accepted'</p>
                        :
                        <button className="btn btn-success"
                            onClick={onAccept(onLoad)}>Accept Request</button>
                }
            </td>
            {console.log('ban', onLoad.banned)}
            {console.log('ban', onClick)}
            <td>
                {
                    onLoad.banned ?
                        <button type='button' className="btn btn-success"
                            onClick={()=>onClick(onLoad)}>Un-Ban Student</button>
                        :
                        <button type='button' className="btn btn-danger" onClick={() => onClick(onLoad)}>Ban Student</button>

                }
            </td>
        </tr>
    )
}

export default Subscription
