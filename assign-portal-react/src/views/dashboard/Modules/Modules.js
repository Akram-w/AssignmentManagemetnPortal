import  Module  from "./Module";
import withAuth from "../../../servicer/withAuth";
const Modules = ({ modules, onUpdate }) => {
    return (
        <>
            <table className='table' style={{ margin: '10px 10px' }}>
                <thead>
                    <tr>
                        <th>Module Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>update</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        modules.map((module) =>
                        (<Module key={module.id} onLoad={module} onUpdate={onUpdate} />))
                    }
                </tbody>
            </table>
        </>
    )
}

export default Modules
