import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import { firestore } from '../firebase';
import { onSnapshot, collection } from 'firebase/firestore';
import { Avatar } from '@mui/material';


function SearchUsers() {

  const { state } = useLocation();
  const email = state && state.email;
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState([]);
   const [filteredUsers, setFilteredUsers] = useState([]);

   const navigate = useNavigate()

   useEffect(() => {
    const b = onSnapshot(collection(firestore, "users"), (snapshot) => {
        const c = snapshot.docs
          .filter(doc => doc.data().email !== email)
          .map(doc => ({ ...doc.data(), id: doc.id }));
        setAllUsers(c);
      });
    return () => b();
    }, []);

    const handleChange = (e) => {
        setSearchTerm(e);
        if (e.length > 0) {
            const filteredUsers = allUsers.filter(user => user.username.toLowerCase().startsWith(e.toLowerCase()));
            setFilteredUsers(filteredUsers);
        }
        if(e.length === 0){
            setFilteredUsers([])
        }
    }




  return (


    <div className="text-center">
    <h1>Search Users</h1>
    <br></br><br></br>
    <input type="text" value={searchTerm} onChange={e => handleChange(e.target.value)} placeholder="Search for a user by username" />
    <br></br><br></br>
    {filteredUsers.length > 0 ? (
      <table className='table '>
        <thead>
          <tr>
            <th></th>
            <th>Username</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.slice(0, 10).map(user => (
            <tr key={user.id}>
              <td><Avatar 
              src={user.profilePic}
              sx={{ width: 30, height: 30 }}/></td>
              <td>{user.username}</td>
              <td><Link to={`viewaccount/${user.username}`}><button className="btn btn-primary">view account</button></Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      searchTerm.length > 0 &&  <p>No user found</p>
    )}
  </div>
  
  )
}

export default SearchUsers