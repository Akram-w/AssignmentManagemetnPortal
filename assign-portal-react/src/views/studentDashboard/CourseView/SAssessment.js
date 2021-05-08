import { useState } from 'react'
import { useRef } from 'react'
import {userService} from '../../../servicer/UserService'

const SAssessment = ({ onLoad, onClick, onUpload ,onMessage,course }) => {
    const [sFile, setSFile] = useState('')
    const [uploadFileName, setUploadFileName] = useState("")
    const inputFile = useRef(null)

    const getUploadStatus = () => {
        let date = new Date(onLoad.submissionDate)
        let now = new Date()

        if (date > now) {
            return true
        } else if (date == now) {
            return true
        }
        return false
    }
    const openFileSelect = () => {
        console.log('openfile')

    }
    function pad(number, length) {
        var str = "" + number
        while (str.length < length) {
            str = '0' + str
        }
        console.log('ss', str)
        return str
    }
    const getSavingDate = () => {
        let date = new Date()
        let day = date.getMonth() + 1;
        if (day < 10) {
            day = '0' + day;
        }
        console.log(day)
        let offset = new Date().getTimezoneOffset()
        let ftz = ((offset < 0 ? '+' : '-') +
            pad(parseInt(Math.abs(offset / 60)), 2) + ":" +
            pad(Math.abs(offset % 60), 2))
        let fd = date.getFullYear() + '-' + day + '-' + date.getDate() + 'T12:00:10' + ftz
        console.log('data', fd)
        return fd
    }
    const onChangeFile = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('inside thi')
        var file = e.target.files[0];
        console.log(file);
        setUploadFileName(file.name)
        setSFile( file ); /// if you want to upload latter
        console.log('selected file', file)
        console.log('selected file', sFile)
        console.log('selected file', uploadFileName)
        upload();
    }
    const upload = () => {
        if (!sFile) {
            onMessage('select file')
            return
        }
        let size = (1024 * 30) + 1
        if (sFile.size > size) {
            onMessage('file size should below 30MB')
            return
        }
        let user = new userService()
        let tutorName = course.course.tutorName
        let courseName = course.course.courseName
        let moduelName = course.module.moduleName
        let path = 'assign-portal/' + tutorName.replace(' ','_') + "/" + courseName.replace(' ','_') 
        + "/" + moduelName.replace(' ','_') + '/submission/'+onLoad.id+"/"+user.getUserName()
        console.log("path ", path)
        let d = {
            studentName: user.getUserName(),
            assessmentId: onLoad.id,
            submissionDate: getSavingDate(),
            basePath: path,
            fileName: uploadFileName
        }
        console.log('uploading',d)
        let form = new FormData();
        form.append('file', sFile)
        form.append('data', JSON.stringify(d))
        onUpload(form)
    }
    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };
    return (
        <tr>
            <td>{onLoad.assessmentName}</td>
            <td>{onLoad.submissionDate}</td>
            <td>
                <button type='button' className='btn btn-primary' onClick={() => onClick(onLoad.id)}>
                    Download</button>
            </td>
            <td>
                {
                    getUploadStatus() ?
                        <>
                            <button type='button' className='btn btn-primary'
                                onClick={onButtonClick}>
                                Upload</button>
                            <input type='file' ref={inputFile} placeholder='choose file' id="file"
                                className="form-control"
                                onChange={onChangeFile} style={{ display: 'none' }} />
                        </>
                        :
                        <p style={{ color: 'red' }}>DeadLine is ended</p>
                }
            </td>
        </tr>
    )
}

export default SAssessment
