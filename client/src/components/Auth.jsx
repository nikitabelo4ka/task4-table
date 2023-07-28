import React, {useContext, useState} from 'react';
import {Container, Form} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE, TABLE_ROUTE} from "../utils/consts";
import {login, registration, changeLastLogin} from "../http/userAPI";
import {Context} from "../index";

const Auth = () => {

    const {user} = useContext(Context);
    const location = useLocation();
    const history = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');

    let lastLoginDate = new Date().toISOString();

    const click = async () => {

        try {
            let data;
            let modidy;

            if (isLogin) {
                data = await login(email, password);
                modidy = await changeLastLogin(email, lastLoginDate);
            } else {
                data = await registration(email, password, firstName, lastLoginDate);
            }

            user.setUser(user);
            user.setIsAuth(true);
            history(TABLE_ROUTE);

        } catch (e) {
            alert(e.message);
        }

    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{height: window.innerHeight - 54}}>
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Authorization' : "Registration"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control className={isLogin ? "d-none" : "mt-3"} placeholder="Enter your name..." value={firstName} onChange={e => setFirstName(e.target.value)}/>
                    <Form.Control className="mt-3" placeholder="Enter your email..." value={email} onChange={e => setEmail(e.target.value)}/>
                    <Form.Control className="mt-3" placeholder="Enter your password..." value={password} onChange={e => setPassword(e.target.value)} type="password"/>
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                No account ? <NavLink style={{textDecoration: "none"}} to={REGISTRATION_ROUTE}>Register !</NavLink>
                            </div>
                            :
                            <div>
                                Have an account ? <NavLink to={LOGIN_ROUTE}>Login !</NavLink>
                            </div>
                        }
                        <Button variant={"outline-success"} onClick={click} className='mt-4' style={{justifyContent: "center"}}>
                            {isLogin ? 'Login' : 'Registration'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
};

export default Auth;