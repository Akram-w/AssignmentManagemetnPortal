import { NavLink } from "react-router-dom"
import { userService } from "../../../servicer/UserService";
import 'bootstrap/dist/css/bootstrap.css'
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import UserName from "./UserName"


const TutorNavLink = ({ onClick, endPath }) => {
    const user = new userService()
    // const setPath = (e) => {
    //     endPath(e)
    //     // console.log(coursesdropdown.value)
    // }
    const setPathh = (e) => {
        endPath(e.target.value)
        // console.log(coursesdropdown.value)
    }
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Navbar.Brand href="#home">Assign-portal</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" style={{ flexDirection: 'row-reverse' }}>
        
                <Nav>
                    <select className='cusselect' style={{ width: '135px', margin: '0 10px 0 0' }} onChange={setPathh}>
                        <option className="dropdown-item" selected='true' disabled='disabled'>Courses</option>
                        <option className="dropdown-item" value="Manage-Courses">Manage-Courses</option>
                        <option className="dropdown-item" value="Manage-Modules">Manage-Modules</option>
                        <option className="dropdown-item" value="Subscriptions">Subscriptions</option>
                    </select>
                    {/* </Nav> */}
                    {/* <Nav> */}
                    <select className='cusselect' style={{ width: '135px', margin: '0 10px 0 0' }} onChange={setPathh}>
                        <option className="dropdown-item" selected='true' disabled='disabled'>Assessments</option>
                        <option className="dropdown-item" value="Manage-Assessments">Manage-Assessments</option>
                        <option className="dropdown-item" value="Submissions">Submissions</option>
                    </select>

                    <select className='cusselect' style={{ width: '135px', margin: '0 10px 0 0' }} onChange={setPathh}>
                        <option className="dropdown-item" selected='true' disabled='disabled'>Attendance</option>
                        <option className="dropdown-item" value="Mark-Attendance">Mark-Attendance</option>
                        <option className="dropdown-item" value="View-Attendance">View-Attendance</option>
                    </select>
                    <select className='cusselect' style={{ width: '135px', margin: '0 10px 0 0' }} onChange={setPathh}>
                        <option className="dropdown-item" selected='true' disabled='disabled'>Schedule</option>
                        <option className="dropdown-item" value="Add-Schedule">Add-Schedule</option>
                        <option className="dropdown-item" value="View-ScheduleT">View-Schedule</option>
                        {/* view schedule shoud come */}
                    </select>
                    {/* </nav> */}
                    {/* <Nav> */}
                    {/* <Nav.Link style={{ color: 'white' }} onClick={setPathh} >
                        <button className="navBtn btn btn-primary" value="changePassword">Change-Password</button>
                    </Nav.Link>

                    <Nav.Link style={{ color: 'white' }} onClick={onClick}>
                        <button className='btn btn-danger'><FaSignOutAlt style={{ marginBottom: "4px" }} /></button>
                    </Nav.Link> */}
                    {/* <Nav.Link style={{color : 'white'}}> */}
                    <UserName onPath={setPathh} onClick={onClick} />
                    {/* </Nav.Link> */}

                </Nav>
            </Navbar.Collapse>
        </Navbar>

    )
}

export default TutorNavLink
