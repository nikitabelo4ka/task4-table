import {React, useContext} from 'react';
import {Context} from "../index";
import {LOGIN_ROUTE} from "../utils/consts";
import {useNavigate} from 'react-router-dom';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Button, Container} from "react-bootstrap";
import jwtDecode from 'jwt-decode';
import "../styles/navbar.css";

const NavBar = () => {

    const {user} = useContext(Context);

    const history = useNavigate();

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem('token');
        history(LOGIN_ROUTE);
    };

    return (
        <Navbar style={{backgroundColor: "black"}}>
            <Container>
                <div style={{marginLeft: "55vw"}}>
                    {user.isAuth ?
                        <Nav>
                            <Button className="navbar-btn" variant={"outline-dark"} onClick={() => logOut()}>
                                Log out
                            </Button>
                        </Nav>
                        :
                        <Nav>
                            <Button className='navbar-btn' variant={"outline-dark"} onClick={() => history(LOGIN_ROUTE)}>Authorization</Button>
                        </Nav>
                    }
                </div>
            </Container>
        </Navbar>

    );
};

export default NavBar;