import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from './views/Login'
import Register from './views/Register'
import Dashboard from './views/dashboard/Dashboard'
import { useState } from 'react'
import { userService } from './servicer/UserService'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useEffect } from 'react';
import { Snackbar } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import {FaTimes} from 'react-icons/fa';




const App = () => {
    useEffect(() => {
        let user = new userService();
        let u = user.getIsLoggin();
        if (u) {
            console.log('avail');
            // Logged();
            setLoginStatus(true)
            setRedStatus(true)
            console.log('hs', loginStatus)
            console.log('hs', redStatus)

        } else {
            console.log('nothing in')
        }
    }, []);

    const [loginViewChange, setLoginViewChange] = useState(false)
    const [loginStatus, setLoginStatus] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [showMsg, setShowMsg] = useState(false)
    const [Msg, setMsg] = useState('')
    const [redStatus, setRedStatus] = useState(false)
    // const history = useHistory();
    //login function
    const authenticateUser = async (formData) => {

        console.log("login form formdata", formData);
        let basepass = Buffer.from('mobile' + ':' + 'pin').toString('base64');

        console.log('Basic ', basepass)
        let dat;
        const headers = new Headers();
        headers.append("Authorization", 'Basic ' + basepass)
        setLoadingStatus(true)
        let status = false;
        const req = await fetch('/api/oauth/token', {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: formData
        }).then(response => {
            if (response.status === 200) {
                let res = response.json();
                status = true
                return res
            } else if (response.status === 400) {
                console.log(response.statusText)
                setSnackBar("Bad credential")
                return false;
            } else if (response.status === 500) {
                setSnackBar("Something went wrong")
                return false
            } else if (response.status === 401) {
                //resresh token
            } else if (response.status === 404) {
                setSnackBar("couldn't find")
                return false
            } else if (response.status === 503) {
                setSnackBar('service unavailable try again later')
                return false
            }else{
                setSnackBar('Something went wrong')
                return false
            }

        }).then(function (data) {
            if (data === false) {
                setLoadingStatus(false)
                console.log('nothinggg')
            } else {
                console.log('inside ', data)
                dat = data;

            }

        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            setSnackBar("Something went wrong try agail later")
            setLoadingStatus(false)
        })
        if (status) {
            console.log('daaaaaaa')
            let user = new userService();
            user.saveOAuthToken(dat)
            getUser(formData.get('username'), dat.access_token)
            console.log('form db auth', user.getOAuthToken())
        }
    }
    const refreshToken = () => {
        let user = new userService();
        let login = new FormData();
        let refT = user.getRefreshToken()
        console.log('refreshtoken', refT)
        login.append('grant_type', 'refresh_token')
        login.append('refresh_token', refT)

        console.log("formd", login);
        let basepass = Buffer.from('mobile' + ':' + 'pin').toString('base64');
        console.log('Basicnn', basepass)
        let dat;
        const headers = new Headers();
        headers.append("Authorization", 'Basic ' + basepass)
        // setLoadingStatus(true)
        let status = false;
        const req = fetch('/api/oauth/token', {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: login
        }).then(response => {
            let res = response.status
            console.log('response is cming')
            if (res === 200) {
                console.log('2000')
                let resp = response.json();
                status = true
                return resp
            } else if (res === 400) {
                console.log("ba", response.statusText)
                // setSnackBar("Bad credential")
                setLoggedOut()
            } else if (res === 500) {
                setSnackBar("Something went wrong")
                return false
            } else if (res === 401) {
                //resresh token
                setLoginViewChange(false)
            } else if (res === 404) {
                setSnackBar("couldn't find")
                return false
            } else if (res === 503) {
                setSnackBar('service unavailable try again later')
                return false
            }
        }).then(function (data) {
            console.log('inside somthig')
            if (data === false) {
                // setLoadingStatus(false)
                console.log('n')
            } else {
                console.log('insiderrr ', data)
                dat = data;
                if (status) {
                    console.log('daaaaaaa')
                    let user = new userService();
                    user.saveOAuthToken(dat)
                    console.log('= refresh auth', user.getOAuthToken())
                    return true
                } else {
                    return false
                }
                // setLoadingStatus(false)
            }

        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            setSnackBar("Something went wrong try agail later")
            // setLoadingStatus(false)
        })
        // return status
        console.log('ini')
        // return status
        //get refresh token from session storage
        //send request to the oauth server and get new token
        //if it return 401 redirect to login
    }
    //getuser object
    const getUser = (userName, token) => {
        const headers = new Headers();
        let btoken = 'Bearer ' + token
        let status = false;
        headers.append("Authorization", btoken)
        const req = fetch('/api/register/' + userName + '/UserName', {
            method: 'GET',
            mode: 'cors',
            headers: headers
        }).then(response => {
            let resStatus = response.status;
            if (resStatus === 200) {
                let res = response.json();
                status = true;
                return res
            } else if (resStatus === 400 || resStatus === 500) {
                console.log(response.statusText)
                setSnackBar("Something went wrong")
                return false;
            } else if (resStatus === 401) {
                //resresh token
            } else if (resStatus === 404) {
                setSnackBar("couldn't find")
                return false
            } else if (resStatus === 503) {
                setSnackBar('service unavailable try again later')
                return false
            }
        }).then(function (data) {
            if (data === false) {
                console.log('nnnothing')
                setLoadingStatus(false)
            } else {
                console.log('data', data)
                let user = new userService();
                user.saveUser(data)
                let db = user.getUser()
                console.log('form db', db)
                console.log('form db', user.getUserName())
                console.log('s', status)
                if (status) {
                    IsLoggedIn()
                }
                setLoadingStatus(false)
            }
        }).catch(error => {
            console.log("error :", error);
            console.log("error code :", error);
            setSnackBar("Something went wrong try agail later")
            setLoadingStatus(false)
        })
        //have token and user object so show dash 

    }
    // save to user register

    const registerUser = (data) => {
        setLoadingStatus(true)
        const req = fetch('/api/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                const resp = response.json()
                console.log('res', resp)
            } else if (response.status === 401) {
                refreshToken()
                setTimeout(function () {
                    setSnackBar('Something went wrong try again')
                    setLoadingStatus(false)
                }, 2000);
            } else {
                setSnackBar("Something went wrong")
                setLoadingStatus(false)

            }
            //save response into the  localsorage
        }).catch(error => {
            console.log("error :", error);
            setSnackBar("Something went wrong try agail later")
            setLoadingStatus(false)
        })
        // const response= await req;
        changeToRegister();
        setLoadingStatus(false)
        console.log('out')
    }

    //changing view to regiser
    const changeToRegister = () => {
        setLoginViewChange(!loginViewChange)
    }

    function IsLoggedIn() {
        // pass this method with to bashboard
        setLoginStatus(true)
        let user = new userService();
        user.setIsLoggin(true);
        setRedStatus(true)
        console.log('this is ha', loginStatus)
        console.log('this is ha', redStatus)
    }
    function Logged() {
        setLoginStatus(true);
        setRedStatus(true)
        console.log('this is ha', loginStatus)
        console.log('this is ha', redStatus)
    }
    const setLoggedOut = () => {
        //logged out user
        setLoginStatus(false)
        setRedStatus(false)
        console.log('inloggeout')
        let user = new userService();
        user.setLoggedOut();
    }


    //show snackbar
    const setSnackBar = (msg) => {
        setShowMsg(true);
        setMsg(msg)
    }
    const loadingMet = (status) => {
        setLoadingStatus(status)
    }
    return (
        <Router>
            <div className="" >
                {
                    loadingStatus &&
                    <div className="centered" >
                        <CircularProgress />
                    </div>
                }
                {loginViewChange ?
                    <Route path='/register' exact render={(props) =>
                        <>
                            <Register type={'institute'}
                                onAdd={registerUser}
                                onChange={changeToRegister} />
                        </>
                    } />
                    :
                    <Route path='/' exact render={(props) =>
                        <>
                            <Login onAdd={authenticateUser} onChange={changeToRegister} />
                        </>
                    } />


                }
                {
                    loginStatus &&
                    // <Route path='/dashboard' exact render={(props) =>

                    <Dashboard load={loadingMet} loggedOut={setLoggedOut} onMessage={setSnackBar} onRegister={registerUser} onRefresh={refreshToken} />

                    // } />
                    // :
                    // ''
                }

                {
                    showMsg &&
                    <Snackbar message={Msg} open={showMsg} autoHideDuration={5000} onClose={() => setShowMsg(false)}
                        action={
                            <React.Fragment>
                                <IconButton size="small" aria-label="close" color="inherit" onClick={() => setShowMsg(false)}>
                                    <FaTimes style={{ color: '#E53935', cursor: 'pointer' }} />
                                </IconButton>
                            </React.Fragment>
                        } />
                }
                {redStatus ? <Redirect to="/dashboard" />
                    :
                    <Redirect to='/' />
                }
            </div>
        </Router>
    )
}
export default App;