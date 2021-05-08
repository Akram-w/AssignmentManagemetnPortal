export class userService {

    saveUser(user) {
        //save user to local storage
        sessionStorage.setItem('user', JSON.stringify(user))
    }
    getUser() {
        let user = sessionStorage.getItem('user')
        let puser = JSON.parse(user)
        return puser

        //get user from local storage
    }
    getUserName(){
        let fuser=this.getUser()
        return fuser.user.username
    }
    getUserType(){
        let fuser=this.getUser();
        return fuser.type
    }
    saveOAuthToken(token) {
        //save token to localstorage
        sessionStorage.setItem('token',JSON.stringify(token))
    }
    getOAuthToken() {
        //return token from local storage
        let token=sessionStorage.getItem('token')
        let parseToken=JSON.parse(token)
        return parseToken

    }
    getToken(){
        let  authToken=this.getOAuthToken()
        return authToken.access_token
    }
    getRefreshToken(){
        let  authToken=this.getOAuthToken()
        return authToken.refresh_token
        // return 'hi'
    }
    //setting log in status if loggedin it is true
    setIsLoggin(status){
        sessionStorage.setItem('isLoggin',status)
    }
    setLoggedOut(){
        sessionStorage.setItem('isLoggin',false)
        sessionStorage.removeItem('token')
        sessionStorage.clear()
    }
    
    getIsLoggin(){
       return sessionStorage.getItem('isLoggin');
    }
}