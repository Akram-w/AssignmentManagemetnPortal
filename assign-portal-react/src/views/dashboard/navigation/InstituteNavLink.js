import { Navbar, Nav, NavDropdown, NavItem } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";

const InstituteNavLink=({ onClick, endPath })=>{
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
            <button className="navBtn btn btn-primary" value="Student-Subscriptions">Subscriptions</button>
          </Nav.Link>
          <Nav.Link style={{ color: 'white' }} onClick={setPathh} >
            <button className="navBtn btn btn-primary" value="Sregister">Register-Student</button>
          </Nav.Link>
          <Nav.Link style={{ color: 'white' }} onClick={setPathh} >
            <button className="navBtn btn btn-primary" value="Tregister">Register-Tutor</button>
          </Nav.Link>
          <Nav.Link style={{ color: 'white' }} onClick={setPathh} >
            <button className="navBtn btn btn-primary" value="UserView">View-Registered-Users</button>
          </Nav.Link>
          <Nav.Link style={{ color: 'white' }} onClick={onClick}>
            <button className='btn btn-danger'><FaSignOutAlt style={{ marginBottom: "4px" }} /></button>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

    )
}

export default InstituteNavLink
