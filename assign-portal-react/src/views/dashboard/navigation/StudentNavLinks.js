import { Link } from "react-router-dom"
import { userService } from "../../../servicer/UserService";
import { Navbar, Nav, NavDropdown, NavItem } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import UserName from "./UserName"
const StudentNavLinks = ({ onClick, endPath }) => {
  const user = new userService()
  const setPathh = (e) => {
    console.log(e.target.value)
    endPath(e.target.value)
    // console.log(coursesdropdown.value)
  }
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand>Assign-portal</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" style={{flexDirection:'row-reverse'}}>
        <Nav >
          <Nav.Link style={{ color: 'white' }} onClick={setPathh}>
            <button className="navBtn btn btn-primary" value="Course-View">Course-View</button>
          </Nav.Link>
          {/* <Nav.Link style={{ color: 'white' }} onClick={setPathh}>
            <button className="navBtn btn btn-primary" value="Student-Subscriptions">Subscriptions</button>
          </Nav.Link> */}
          <Nav.Link style={{ color: 'white' }} onClick={setPathh} >
            <button className="navBtn btn btn-primary" value="View-ScheduleS">Schedules</button>
          </Nav.Link>
          {/* <Nav.Link style={{ color: 'white' }} onClick={setPathh} >
            <button className="navBtn btn btn-primary" value="changePassword">Change-Password</button>
          </Nav.Link>
          <Nav.Link style={{ color: 'white' }} onClick={onClick}>
            <button className='btn btn-danger'><FaSignOutAlt style={{ marginBottom: "4px" }} /></button>
          </Nav.Link> */}
          <Nav.Link style={{ color: 'white',marginTop:'5px' }}>
          <UserName onPath={setPathh} onClick={onClick}/>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

  )
}

export default StudentNavLinks
