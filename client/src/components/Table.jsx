import { React, useContext, useEffect } from 'react';
import { fetchUsers, deleteUser, changeStatus, changeAdmin } from '../http/userAPI';
import {useNavigate} from 'react-router-dom';
import {LOGIN_ROUTE} from "../utils/consts";
import {Context} from '../index';
import {observer} from 'mobx-react';
import jwtDecode from 'jwt-decode';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import "../styles/admin.css";

const Admin = observer(() => {

  const history = useNavigate();

  const { user } = useContext(Context);

  const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null;

  useEffect(() => {
    fetchUsers().then((data) => user.setUsers(data));
  }, []);

  const Delete = (userId) => {
    if (token && token.id === userId) {
      user.setUser({});
      user.setIsAuth(false);
    }
    deleteUser(userId)
      .then(fetchUsers)
      .then((data) => user.setUsers(data));
  };

  const checkStatus = (id, status) => {
    if (token && token.id === id && token.status === status) {
      user.setUser({});
      user.setIsAuth(false);
      history(LOGIN_ROUTE);
    }
  };

  const ChangeStatus = (id, status) => {
    if (status === 'ACTIVE') {
      changeStatus(id, 'BLOCKED')
        .then(checkStatus(id, status))
        .then(fetchUsers)
        .then((data) => user.setUsers(data));
    } else {
      changeStatus(id, 'ACTIVE')
        .then(fetchUsers)
        .then((data) => user.setUsers(data));
    }
  };

  return (
    <table className="table table-striped admin-table">
      <thead className="thead-dark">
        <tr>
          <th>ID</th>
          <th>Firstname</th>
          <th>Email</th>
          <th>Status</th>
          <th>Registration date</th>
          <th>Last login date</th>
          <th className="d-md-none">Actions</th>
          <th className="d-none d-md-table-cell"></th>
          <th className="d-none d-md-table-cell"></th>
        </tr>
      </thead>
      <tbody>
        {user.users.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.firstName}</td>
            <td>{item.email}</td>
            <td>{item.status}</td>
            <td>{item.createdAt.slice(0, 10)}</td>
            <td>{item.lastLoginDate.slice(0, 10)}</td>
            <td className="d-md-none">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" className="admin-btn">
                  Select action
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item className="admin-btn" onClick={() => ChangeStatus(item.id, item.status)}>
                    {item.status === 'ACTIVE' ? 'Block user' : 'Unblock user'}
                  </Dropdown.Item>
                  <Dropdown.Item className="admin-btn" onClick={() => Delete(item.id)}>
                    Delete user
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
            <td className="d-none d-md-table-cell">
              <Button
                variant={item.status === 'ACTIVE' ? 'danger' : 'success'}
                onClick={() => ChangeStatus(item.id, item.status)}
                className="admin-btn"
              >
                {item.status === 'ACTIVE' ? 'Block user' : 'Unblock user'}
              </Button>
            </td>
            <td className="d-none d-md-table-cell">
              <Button variant="danger" onClick={() => Delete(item.id)} className="admin-btn">
                Delete user
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default Admin;
