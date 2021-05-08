
import { useState } from 'react'
import { Link } from "react-router-dom";

const Login = ({ onAdd,onChange }) => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [userNameError, setUserNameError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        setUserNameError('')
        setPasswordError('')
        if (!userName) {
            setUserNameError('User Name is empty')
            console.log({ userNameError })
            return
        }
        if (!password) {
            setPasswordError("Password couldn't be empty")
            console.log(passwordError)
            return
        }
        let login = new FormData();
        login.append('grant_type', 'password')
        login.append('username',  userName )
        login.append('password',  password )
        // let login = {
        //     'grant_type': 'password',
        //     'username': userName,
        //     'password': password
        // }

        // console.log(login.username);
        onAdd(login)
        setUserName('')
        setPassword('')
    }

    const loggedIn = () => { }
    return (
        <div className="loginwrapper" style={{margin:'100px auto'}}>
            <h3 className="headingPara">Log in to Your Account</h3>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor="userName">User Name</label>
                    <input type='text' placeholder='User Name' id="userName"
                        value={userName}
                        className="form-control"
                        onChange={(e) => setUserName(e.target.value)} />
                    <p className="formError">{userNameError}</p>
                </div>
                <div className='form-group'>
                    <label htmlFor="password">password</label>
                    <input type='password' placeholder='Password' id="password"
                        value={password}
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)} />
                    <p className="formError">{passwordError}</p>
                </div>
                <input type="submit" value="LOGIN" className="btn btn-success btn-block" />
            </form>
            <p className="loginPara">Need an account?  <Link to='/register' className="link" onClick={onChange}>Sign up</Link></p>
        </div>
    )
}

export default Login
