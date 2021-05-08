import { useState } from 'react'
import { userService } from '../../../servicer/UserService'

const PasswordChanger = ({ onMessage, onLoad, onRefresh }) => {
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [cPassword, setCPassword] = useState('')
    const [cPasswordError, setCPasswordError] = useState('')
    const onSubmit = (e) => {
        e.preventDefault()

        setPasswordError('')
        setCPasswordError('')

        if (!password) {
            setPasswordError('password is empty')
            return
        }
        if (password.length <= 6) {
            setPasswordError('password length should more than 6')
            return
        }
        if (!cPassword) {
            setCPasswordError('Confirm password is empty')
            return
        }
        if (password !== cPassword) {
            setCPasswordError('Pasword and confirm password must be same')
            return
        }
        let user = new userService()
        let name = user.getUserName()

        let form = new FormData();
        form.append('body', password)
        form.append('name', name)

        changeReq(form)
    }
    const changeReq = (form) => {
        onLoad(true)
        let user = new userService()
        let token = user.getToken()
        let btoken = 'Bearer ' + token

        const headers = new Headers();
        headers.append("Authorization", btoken)
        headers.delete('Content-Type');
        const req = fetch('/api/register/changePassword', {
            method: 'PUT',
            mode: 'cors',
            body: form,
            headers: headers
        }).then(response => {
            let resStatus = response.status
            if (response.status === 200) {
                // const resp = response.json()
                onMessage('Password changed')
                onLoad(false)
                setPassword('')
                setCPassword('')

            } else if (resStatus === 400 || resStatus === 500) {
                console.log(response.statusText)
                onMessage("Something went wrong")
                onLoad(false)
            } else if (resStatus === 503) {
                onMessage('Service Unavailable');
                onLoad(false)
            } else if (resStatus === 401) {
                onRefresh()
                setTimeout(function () {
                    onMessage('Something went wrong try again')
                    onLoad(false)
                }, 2000);

            } else if (resStatus === 404) {
                onMessage("Unable to find")
                onLoad(false)
            } else if (resStatus === 406) {
                onMessage("couldn't find the downloadable file")
                onLoad(false)
            }
            //save response into the  localsorage
        }).catch(error => {
            console.log("error :", error);
            onMessage("Something went wrong try agail later")
        })
    }
    return (
        <div className="loginwrapper">
            <h3 className="headingPara">Change Password</h3>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    <input type='password' placeholder='Password' id="password"
                        value={password}
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)} />
                    <p className="formError">{passwordError}</p>
                </div>
                <div className='form-group'>
                    <label htmlFor="Cpassword">Confirm Password</label>
                    <input type='password' placeholder='Confirm Password' id="Cpassword"
                        value={cPassword}
                        className="form-control"
                        onChange={(e) => setCPassword(e.target.value)} />
                    <p className="formError">{cPasswordError}</p>
                </div>
                <input type="submit" value="CHANGE" className="btn btn-success btn-block" />
            </form>
        </div>
    )
}
export default PasswordChanger
