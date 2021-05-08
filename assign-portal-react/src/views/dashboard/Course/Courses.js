import Course from "./Course"
import withAuth from "../../../servicer/withAuth";

const Courses = ({ courses, onUpdate }) => {
    return (
        <>
            <table className='table' style={{margin:'10px 10px'}}>
                <thead>
                <tr>
                    <th>Course Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Update</th>
                </tr>
                </thead>
                <tbody>
                {
                    courses.map((course) =>
                        <Course key={course.id} onLoad={course} onUpdate={onUpdate} />)
                }
                </tbody>
            </table>


        </>
    )
}

export default Courses
