import { Link, useNavigate } from 'react-router-dom';

import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Menu = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const logout = useLogout();

  const logOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" bg="light" variant="light" sticky="top">
      <Container>
        <Navbar.Brand>
          <img
            alt=""
            src="logo512.png"
            width="30"
            height="30"
            className="d-inline-block align-top mx-2"
          />
          MyFinance
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to=".">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="accounts">
              Accounts
            </Nav.Link>
            <Nav.Link as={Link} to="transactions">
              Transactions
            </Nav.Link>
            <Nav.Link as={Link} to="import">
              Import
            </Nav.Link>
            <Nav.Link as={Link} to="deposits">
              Deposits
            </Nav.Link>
          </Nav>
          <Dropdown>
            <Dropdown.Toggle variant="outline" className="px-0">
              {auth?.email}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item variant="danger" onClick={logOut}>
                Log out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
