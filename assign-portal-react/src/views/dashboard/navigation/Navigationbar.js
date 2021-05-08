import React, { useState } from "react";
import { userService } from '../../../servicer/UserService'
import StudentNav from './StudentNavLinks'
import TutorNav from './TutorNavLink'
import InstNav from './InstituteNavLink'

const Navigationbar = ({ loggedOut,endPath }) => {
  const [isOpen, setOpen] = useState(false);
  const user = new userService()
  const logout=()=>{
    //logout
    loggedOut();
  }
  console.log(user.getUserType())
  return (
          
          user.getUserType() == 'student' ?
            <StudentNav onClick={logout} endPath={endPath}/>
            :
            user.getUserType()=='tutor'?
            <TutorNav onClick={logout} endPath={endPath}/>
            :
            <InstNav onClick={logout} endPath={endPath}/>
           
        
  );
}
export default Navigationbar;
