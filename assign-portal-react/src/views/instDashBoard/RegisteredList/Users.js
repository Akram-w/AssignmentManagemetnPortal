import User from "./user";

const Users=({data})=> {
    return (
        <>
        <table className='table' style={{ margin: '10px 10px' }}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((data) =>
                    (<User key={data.id} onLoad={data}/>))
                }
            </tbody>
        </table>
    </>
    )
}

export default Users
