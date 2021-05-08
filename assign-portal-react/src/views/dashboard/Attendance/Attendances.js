import Attendace from "./Attendance";

const Attendances = ({ subs, onClick, status }) => {
    console.log('befor ret')
    return (
        <>
            <table className='table' style={{ margin: '10px 10px' }}>
                <thead>
                    {
                        status ?
                            <tr>
                                <th>Student Name</th>
                                <th>status</th>
                            </tr>
                            :
                            <tr>
                                <th>Student Name</th>
                                <th>Attended</th>
                            </tr>
                    }
                </thead>
                <tbody>
                    {
                        subs.map((sub) =>
                            <Attendace key={sub.attendanceId} onLoad={sub} onClick={onClick} onStatus={status} />)
                    }
                </tbody>
            </table>
        </>
    )
}

export default Attendances
