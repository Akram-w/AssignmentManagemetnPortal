import  Assessment  from "./Assessment";
import withAuth from "../../../servicer/withAuth";

const Assessments=({assessments,onClick})=> {
    return (
        <>
            <table className='table' style={{ margin: '10px 10px' }}>
                <thead>
                    <tr>
                        <th>Assessment Name</th>
                        <th>Submission Date</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        assessments.map((module) =>
                        (<Assessment key={module.id} onLoad={module} onClick={onClick}/>))
                    }
                </tbody>
            </table>
        </>
    )
}

export default Assessments
