import { useState } from 'react'
import { userService } from '../../../servicer/UserService'
import { useEffect } from 'react'
import withAuth from "../../../servicer/withAuth";

const AddModules = ({ onAdd, onUpdate, selectedData }) => {
    useEffect(() => {
        console.log('hds', onUpdate)
        if (onUpdate) {
            console.log('hs')

        }
    }, []);
    const [moduleName, setModuleName] = useState('')
    const [moduleNameError, setModuleNameError] = useState('')
    const [moduleDescription, setModuleDescription] = useState('')
    const [moduleDescriptionError, setModuleDescriptionError] = useState('')
    const [status,setStatus]=useState(true)

    const onSubmit = (e) => {
        e.preventDefault()
        setModuleNameError('')
        setModuleDescriptionError('')

        if(!moduleName){
            setModuleNameError('Module Name is Empty')
            return
        }
        if(!moduleDescription){
            setModuleDescriptionError('Description is Empty')
            return
        }
        console.log('slsl',selectedData)
        let data={
            moduleName:moduleName,
            moduleDescription:moduleDescription,
            courseId:selectedData.id,
            active:status
        }
        onAdd(data)
    }

    return (
        <div className='wrapper ' style={{ margin: '85px 50px' }}>
            <h3 className="headingPara">Add Modules</h3>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor="moduleName">Module Name</label>
                    <input type='text' placeholder='Module Name' id="moduleName"
                        value={moduleName}
                        className="form-control"
                        onChange={(e) => setModuleName(e.target.value)} />
                    <p className="formError">{moduleNameError}</p>
                </div>
                <div className='form-group'>
                    <label htmlFor="courseDescription">Module Description</label>
                    <textarea type='textarea' placeholder='Description' id="courseDescription"
                        value={moduleDescription}
                        className="form-control"
                        onChange={(e) => setModuleDescription(e.target.value)} />
                    <p className="formError">{moduleDescriptionError}</p>
                </div>
                {/* <div className='form-group'>
                    <label htmlFor="CourseName">Course Name</label>
                    <input type='text' disabled="disabled" placeholder='Course Name' id="courseName"
                        value={selectedData.course.courseName}
                        className="form-control"/>
                </div> */}
                <div className='form-control-check'>
                    <label>Status</label>
                    <input type='checkbox'
                        checked={status}
                        value={status}
                        onChange={(e) => setStatus(e.currentTarget.checked)} />
                </div>
                {

                    onUpdate?
                        <input type="submit" value="UPDATE" className="btn  btn-sucess btn-block" />
                        :
                        <input type="submit" value="SAVE" className="btn btn-success btn-block" />
                }

            </form>
        </div>
    )
}

export default AddModules
