import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useLogout from '../hooks/useLogout';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const Menu = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const logOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" bg="light" variant="light">
      <Container>
        <Navbar.Brand>MyFinance</Navbar.Brand>
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
            <Button onClick={logOut}>Log out</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
