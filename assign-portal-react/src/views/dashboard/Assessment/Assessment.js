
const Assessment = ({ onLoad, onClick }) => {
    return (
        <tr>
            <td>{onLoad.assessmentName}</td>
            <td>{onLoad.submissionDate}</td>
            <td>
                <button type='button' className='btn btn-primary' onClick={() => onClick(onLoad.id)}>Download</button>
            </td>
        </tr>
    )
}

export default Assessment
