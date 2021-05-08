import withAuth from "../../../servicer/withAuth"
import { userService } from "../../../servicer/UserService"
import { useState } from 'react'
// selectedData is with course and moduel object
const AddAssessment = ({ onAdd, selectedData }) => {
    const [assessmentName, setAssessmentName] = useState('')
    const [assessmentNameError, setAssessmentNameError] = useState('')
    const [submissionDate, setSubmissionDate] = useState('')
    const [submissionDateError, setSubmissionDateError] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [selectedFileName, setSelectedFileName] = useState('')
    const [selectedFileError, setSelectedFileError] = useState('')
    const onSubmit = (e) => {
        e.preventDefault()
        setAssessmentNameError('')
        setSubmissionDateError('')
        console.log(selectedFile)
        if (!assessmentName) {
            setAssessmentNameError('Assessment Name is Empty')
            return
        }
        if (!submissionDate) {
            setSubmissionDateError('choose Submission Date')
            return
        }
        if (!selectedFile) {
            setSelectedFileError('select file')
            return
        }
        let size = (1024 * 30) + 1
        if (selectedFile.size > size) {
            setSelectedFileError('file size should below 30MB')
            return
        }
        let user = new userService()
        console.log(selectedData())
        let tutorName = selectedData().course.tutorName
        let courseName = selectedData().course.courseName
        let moduelName = selectedData().module.moduleName
        let path = 'assign-portal/' + tutorName.replace(' ','_') + "/" + courseName.replace(' ','_') 
        + "/" + moduelName.replace(' ','_') + '/assessments'
        console.log("path ", path)
        let data = {
            assessmentName: assessmentName,
            submissionDate: submissionDate,
            path: path,
            modelId: selectedData().module.id
        }
        let form = new FormData();
        form.append('file', selectedFile)
        form.append('data', JSON.stringify(data))
        onAdd(form)
        setAssessmentName('')
        setSubmissionDate('')
        setSelectedFile(null)
    }
   const onChangeFile=(e)=> {
        e.stopPropagation();
        e.preventDefault();
        console.log('inside thi')
        var file = e.target.files[0];
        console.log(file);
        setSelectedFileName(file.name)
        setSelectedFile(file);
        console.log('selected file',file)
        console.log('selected file',selectedFile)
    }
    return (
        <div className="loginwrapper">
            <h3 className="headingPara">Add Assessment</h3>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor="AssessName">Assessment Name</label>
                    <input type='text' placeholder='Assessment Name' id="assessName"
                        value={assessmentName}
                        className="form-control"
                        onChange={(e) => setAssessmentName(e.target.value)} />
                    <p className="formError">{assessmentNameError}</p>
                </div>
                
                <div className='form-group'>
                    <label htmlFor="chooseDate">Choose Date</label>
                    <input type='date' placeholder='Submission Date' id="chooseDate"
                        value={submissionDate}
                        className="form-control"
                        onChange={(e) => setSubmissionDate(e.target.value)} />
                    <p className="formError">{submissionDateError}</p>
                </div>
                <div className='form-group'>
                    <label htmlFor="file">Choose File</label>
                    <input type='file' placeholder='choose file' id="file"
                        className="form-control"
                        onChange={onChangeFile} />
                    <p className="formError">{selectedFileError}</p>
                </div>

                <input type="submit" value="ADD ASSESSMENT" className="btn btn-success btn-block" />
            </form>
        </div>
    )
}

export default AddAssessment
