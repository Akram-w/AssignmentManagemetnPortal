import { useState } from 'react'

const Attendance = ({ onLoad, onClick, onStatus }) => {

    const [status, setStatus] = useState(onLoad.attended)
    const onChange = (e) => {
        setStatus(e.currentTarget.checked)
        onClick(onLoad, !status)
        
    }
    console.log('sttt',onStatus)
    return (
        <>
            {
                onStatus ?
                    <tr>
                        <td>{onLoad.attendanceId.studentName}</td>
                        <td>{onLoad.attended?<p style={{color:'green'}}>Attended</p>:<p style={{color:'red'}}>Not-Attended</p>}</td>
                    </tr>
                    :
                    <tr>
                    <td>{onLoad.attendanceId.studentName}</td>
                    <td>
                        <div style={{ marginLeft: '5px' }}>
                            <label>Attended</label>
                            <input type="checkbox" checked={status}
                                value={status}
                                onChange={(e) => onChange(e)} />
                        </div>
                    </td>
                </tr>
            }
        </>
    )
}

export default Attendance
