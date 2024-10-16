import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
  } from '@chakra-ui/react'
import { useState,useEffect } from 'react';
import {getUsers} from "../services/UserService";

const Users = ()=> {
    const [users, setUsers] = useState([]);

const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
}

useEffect(()=> {
    fetchUsers();
},[]);

    return (
        <>
        <h6>Users</h6>
        <UnorderedList>
            {users.map((user)=> (
                <ListItem key={user.id}>{user.fullName}</ListItem>
            ))}
        </UnorderedList>
        </>
    )
}

export default Users;