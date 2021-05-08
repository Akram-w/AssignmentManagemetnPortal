import withAuth from "../../../servicer/withAuth";
const Module=({ onLoad, onUpdate })=>{
    return (
        <tr>
            <td>{onLoad.moduleName}</td>
            <td>{onLoad.moduleDescription}</td>
            <td>
                {
                    onLoad.active ?
                        <p style={{ color: 'green' }}>Active</p>
                        :
                        <p style={{ color: 'red' }}>Not-Active</p>
                }
            </td>
            <td>
                <button type='button' className='btn btn-primary'onClick={() => onUpdate(onLoad.id)}>Update</button>
            </td>
        </tr>
    )
}

export default Module
