import SAssessment from './SAssessment'

const SAssessments=({assessments,onClick,onUpload,onMessage,course})=>{
    return (
        <>
        <table className='table' style={{ margin: '10px 10px' }}>
            <thead>
                <tr>
                    <th>Assessment Name</th>
                    <th>Submission Date</th>
                    <th>Download</th>
                    <th>Upload</th>
                </tr>
            </thead>
            <tbody>
                {
                    assessments.map((module) =>
                    (<SAssessment key={module.id} onLoad={module} onClick={onClick} 
                        onUpload={onUpload} onMessage={onMessage} course={course}/>))
                }
            </tbody>
        </table>
    </>
    )
}

export default SAssessments
