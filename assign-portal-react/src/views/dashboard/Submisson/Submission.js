
const Submission=({ onLoad, onClick })=>{
    return (
        <tr>
            <td>{onLoad.studentName}</td>
            <td>{onLoad.submissionDate}</td>
            <td>
                <button type='button' className='btn btn-primary' onClick={() => onClick(onLoad.id)}>Download</button>
            </td>
        </tr>
    )
}

export default Submission
