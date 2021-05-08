import React from 'react'
import { userService } from "../../../servicer/UserService";
import {FaUserCircle } from "react-icons/fa"
import { FaSignOutAlt } from "react-icons/fa";

function UserName({onPath,onClick}) {
    let user=new userService();
    return (
        <select className='cusselect' style={{ width: '135px', margin: '0 10px 0 0' }} >
            <option className="dropdown-item" selected='true' disabled='disabled'>
                {`Hi, ${user.getUserName()}`}
            </option>
            {
                (user.getUserType() =='student' || user.getUserType()=='tutor') ? 
                <option className="dropdown-item" onClick={onPath} value="changePassword">Change-Password</option>
                : ""
            }
            <option className="dropdown-item" onClick={onClick}>
                Sign-out
                </option>
            
            {/* view schedule shoud come */}
        </select>
    )
}

export default UserName
