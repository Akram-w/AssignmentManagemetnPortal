import Submission from './Submission'
const Submissions=({submission,onClick})=>{
    return (
        <>
        <table className='table' style={{ margin: '10px 10px' }}>
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Submitted Date</th>
                    <th>Download</th>
                </tr>
            </thead>
            <tbody>
                {
                    submission.map((module) =>
                    (<Submission key={module.id} onLoad={module} onClick={onClick}/>))
                }
            </tbody>
        </table>
    </>
    )
}

export default Submissions
