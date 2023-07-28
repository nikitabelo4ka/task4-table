import { React, useContext, useEffect, useState } from 'react';
import { fetchUsers, deleteUser, changeStatus, fetchUser } from '../http/userAPI';
import {useNavigate} from 'react-router-dom';
import {LOGIN_ROUTE} from "../utils/consts";
import {Context} from '../index';
import {observer} from 'mobx-react';
import jwtDecode from 'jwt-decode';
import { MaterialReactTable } from 'material-react-table';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import "../styles/admin.css";

const Admin = observer(() => {

  const history = useNavigate();

  const { user } = useContext(Context);

  const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null;

  const [columns, setColumns] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const tableHead = ['id', 'firstName', 'email', 'status', 'createdAt', 'lastLoginDate'];

  useEffect(() => {
    fetchUsers().then((data) => {
      user.setUsers(data);
      const cols = tableHead.map((item) => ({
        header: item,
        accessorKey: item,
        filterVariant: 'text',
        Cell: ({cell}) => item.includes("createdAt") ? cell.getValue().slice(0, 10) : (item.includes("lastLoginDate") ? cell.getValue().slice(0, 10) : cell.getValue())
      }));
      setColumns(cols);
    });
  }, []);

  const checkStatus = (id, status) => {
    if (token && token.id === id && token.status === status) {
      user.setUser({});
      user.setIsAuth(false);
      history(LOGIN_ROUTE);
    }
  };

  console.log(token.id);

  const Delete = () => {
    Object.keys(rowSelection).map((item) => {
      if (token && token.id === item) {
        user.setUser({});
        user.setIsAuth(false);
      }
      deleteUser(item)
        .then(fetchUsers)
        .then((data) => user.setUsers(data));
    })
  }

  const Change = () => {
    Object.keys(rowSelection).map((item) => {
      fetchUser(item).then((data) => {
        if (data.status === 'ACTIVE') {
          changeStatus(data.id, 'BLOCKED')
            .then(checkStatus(data.id, data.status))
            .then(fetchUsers)
            .then((data) => user.setUsers(data));
        } else {
          changeStatus(item, 'ACTIVE')
            .then(fetchUsers)
            .then((data) => user.setUsers(data));
        }
      })
    })
  }

  return (
    <Container style={{marginTop: "100px"}}>
      <div style={{marginBottom: "30px"}}>
        <Button variant="danger" onClick={Delete} style={{marginRight: "10px"}}>Delete</Button>
        <Button variant="warning" onClick={Change}>Block/Unblock</Button>
      </div>
      <MaterialReactTable 
        getRowId={(row) => row.id} 
        enableRowSelection columns={columns} 
        data={user.users} 
        initialState={{ showColumnFilters: true }} 
        onRowSelectionChange={setRowSelection} 
        state={{ rowSelection }}
      />
    </Container>
  );
});

export default Admin;
