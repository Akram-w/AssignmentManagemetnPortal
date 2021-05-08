import { useState } from 'react'
import { Link } from "react-router-dom";
import { userService } from "../servicer/UserService";

const Register = ({ onChange, onAdd, type }) => {
    const [userName, setUserName] = useState('')
    const [userNameError, setUserNameError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [cpassword, setCpassword] = useState('')
    const [cpasswordError, setCpasswordError] = useState('')
    const [email, setEmail] = useState('')
    const [EmailError, setEmailError] = useState('')


    const onSubmit = (e) => {
        e.preventDefault()

        setUserNameError('')
        setPasswordError('')
        setCpasswordError('')
        setEmailError('')

        if (!userName) {
            setUserNameError('User Name is empty')
            console.log(userNameError)
            return
        }
        if (!password) {
            setPasswordError('password is empty')
            return
        }
        if (password.length <= 6) {
            setPasswordError('password length should more than 6')
            return
        }
        if (!cpassword) {
            setCpasswordError('Confirm password is empty')
            return
        }
        if (password !== cpassword) {
            setCpasswordError('Pasword and confirm password must be same')
            return
        }
        if (!email) {
            setEmailError('Email is empty')
            return
        }
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!(re.test(String(email).toLowerCase()))) {
            setEmailError('Email not valid')
            return
        }
        let name = getInstituteName();
        let data = {
            user: {
                username: userName,
                password: password,
                email: email,
                instituteName: name,
                userTypeStatus: true,
                enabled: true,
                accountNonExpired: true,
                credentialsNonExpired: true,
                accountNonLocked: true
            },
            type: type
        }
        onAdd(data);
        setUserName('')
        setPassword('')
        setCpassword('')
        setEmail('')
        //all validations are done now send request and test
    }
    const getInstituteName = () => {
        let user = new userService();
        switch (type) {
            case 'institute':
                return 'null';
            case 'student':
                return user.getUserName();
            case 'tutor':
                return user.getUserName();
        }
    }
    return (
        <div className="loginwrapper">
            <h3 className="headingPara">
                {
                    type==='institute'?'Create Institute Account':
                    type==='student'?'Create Student Account': 'Create Tutor Account'
                }</h3>
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
                <div className='form-group'>
                    <label htmlFor="conformPassword">Confirm Password</label>
                    <input type='password' placeholder='Confirm Password' id="conformPassword"
                        value={cpassword}
                        className="form-control"
                        onChange={(e) => setCpassword(e.target.value)} />
                    <p className="formError">{cpasswordError}</p>
                </div>
                <div className='form-group'>
                    <label htmlFor="email">Email</label>
                    <input type='email' placeholder='Email' id="email"
                        value={email}
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)} />
                    <p className="formError">{EmailError}</p>
                </div>
                <input type="submit" value="SIGN UP" className="btn btn-success btn-block" />
            </form>
            {type == 'institute' &&
                <p className="loginPara">Already have an account?  <Link to='/' className="link" onClick={onChange}>Sign in</Link></p>
            }
        </div>
    )
}

export default Register
