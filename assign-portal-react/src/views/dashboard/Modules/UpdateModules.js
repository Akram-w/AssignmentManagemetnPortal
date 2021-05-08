import { useState } from 'react'
import React, { useEffect } from 'react'

function UpdateModules({ onAdd, onUpdate, selectedData }) {
    useEffect(() => {
        console.log('hds', onUpdate)
        if (onUpdate) {
            console.log('hs')
            setModuleName(selectedData.module.moduleName)
            setModuleDescription(selectedData.module.moduleDescription)
            setStatus(selectedData.module.active)
        }
    }, []);
    const [moduleName, setModuleName] = useState(selectedData.module.moduleName)
    const [moduleNameError, setModuleNameError] = useState('')
    const [moduleDescription, setModuleDescription] = useState(selectedData.module.moduleDescription)
    const [moduleDescriptionError, setModuleDescriptionError] = useState('')
    const [courseName,setCourseName]=useState(selectedData.course.courseName)
    const [status,setStatus]=useState(selectedData.module.active)

    console.log('this',selectedData)
    console.log('this',moduleName)
    const onSubmit = (e) => {
        e.preventDefault()
        setModuleNameError('')
        setModuleDescriptionError('')
        console.log(moduleName)
        console.log(!moduleName)

        if(!moduleName){
            setModuleNameError('Module Name is Empty')
            return
        }
        if(!moduleDescription){
            setModuleDescriptionError('Description is Empty')
            return
        }
        let data={
            id:selectedData.module.id,
            moduleName:moduleName,
            moduleDescription:moduleDescription,
            courseId:selectedData.course.id,
            active:status
        }
        onAdd(data)
        setModuleName('')
        setModuleDescription('')
        setCourseName('')
        setStatus(false)
    }

    return (
        <div className='wrapper 'style={{margin:'85px 50px'}}>
        <h3 className="headingPara">Update Module</h3>
        <form onSubmit={onSubmit} >
            <div className='form-group'>
                <label htmlFor="moduleName">Module Name</label>
                <input type='text' placeholder='Module Name' id="moduleName"
                    value={moduleName}
                    className="form-control"
                    onChange={(e) => setModuleName(e.target.value)} />
                <p className="formError">{moduleNameError}</p>
            </div>
            {/* <div className='form-group'>
                    <label htmlFor="CourseName">Course Name</label>
                    <input type='text' contentEditable="false" placeholder='Course Name' id="courseName"
                        value={courseName}
                        onChange={(e)=>setCourseName(e.target.value)}
                        className="form-control"/>
                </div> */}
            <div className='form-group'>
                <label htmlFor="moduleDescription">Module Description</label>
                <textarea type='textarea' placeholder='Description' id="moduleDescription"
                    value={moduleDescription}
                    className="form-control"
                    onChange={(e) => setModuleDescription(e.target.value)} />
                <p className="formError">{moduleDescriptionError}</p>
            </div>
            <div className='form-control-check'>
                <label>Status</label>
                <input type='checkbox'
                    checked={status}
                    value={status}
                    onChange={(e) => setStatus(e.currentTarget.checked)} />
            </div>
            {

                onUpdate ?
                    <input type="submit" value="UPDATE" className="btn btn-success btn-block" />
                    :
                    <input type="submit" value="SAVE" className="btn btn-success btn-block" />
            }

        </form>
    </div>
    )
}

export default UpdateModules
