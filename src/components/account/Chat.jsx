import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { onSnapshot, collection, addDoc } from 'firebase/firestore';

import { firestore } from '../../firebase';





function Chat() {

const navigate = useNavigate();
const { state } = useLocation();
  const email = state && state.email;
const { username} = useParams();
const [allUsers, setAllUsers] = useState([]);
const [chats, setChats] = useState([]);

useEffect(() => {
  const b = onSnapshot(collection(firestore, "users"), (snapshot) => {
    const c = snapshot.docs
      .filter(doc => doc.data().email !== email)
      .map(doc => ({ ...doc.data(), id: doc.id }));
    setAllUsers(c);
  });
  const f = onSnapshot(collection(firestore, "chats"), (snapshot) => {
    const chats = snapshot.docs.
    filter((doc) => (doc.data().email1 === email || doc.data().email2 === email) || (doc.data().email1 === "general" && doc.data().email2 === "general"))
    .map((doc) => {
      const chat = { ...doc.data(), id: doc.id };
      const messagesRef = collection(doc.ref, "messages");
      const messages = [];
  
      onSnapshot(messagesRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id });
        });
      });
  
      return { ...chat, messages };
    });
    
    setChats(chats);
  });

  return () => {
    b();
    f();
    };  
}, [])


const handleNewChat = async () => {
  let checkuser = prompt("Enter the username of the user you want to chat with")
  if (checkuser === null) {
    return;
  }
  let email2="";
  let flag = false;
  let flag2 = true;

  allUsers.map((user) => {
    if (user.username === checkuser) {
      email2 = user.email;
     
      flag2 = false;
    }
  });

  chats.map((user) => {
    if (user.email1 === email2 || user.email2 === email2) {
      alert("chat already exists");
      flag = true;
    }
  });

  

  if (flag2) {
    alert("User does not exist");
    return;
  }


  if (flag === false && flag2 === false) {
  
    const newChatRef = await addDoc(collection(firestore, "chats"), {
      email1: email,
      email2: email2
    });
    const newMessagesRef = collection(newChatRef, "messages");
    await addDoc(newMessagesRef, {text:""});
  }
}

const navigateBlockList = () => {
navigate (`/blocklist`,{state: {email: email}});
}

const navigateGeneralChat = () => {
  navigate('/chatgeneral', { state: { email } });
}
const navigatePrivateChat = (usernameUser,email) => {
  navigate(`/chat/${username}/${usernameUser}`, { state: { email } });
}

  return (
    <div className="text-center">
      <div className="bg-dark text-white"><h1 >Chats </h1> </div>
    <table className="table table-hover">
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          chats.map((chat) => {
            
        if (chat.email1 === "general" && chat.email2 === "general") {
            return (
              <tr key={chat.id}>
                <th><div className="btn btn-success" onClick={navigateGeneralChat}>Global Chat</div></th>
              </tr>
            );
        }
          })
        
        }
      
      {
  allUsers.map((name) => {
    let chatWithUser = chats.find((chat) => chat.email1 === name.email || chat.email2 === name.email);
    if (chatWithUser) {
      return (
        <tr key={name.email}>
          <th><div className="btn btn-secondary" onClick={() => navigatePrivateChat(name.username, email)}>Chat with {name.username}</div></th>
        </tr>
        
      );
    }
    return null;
  })
}
    </tbody>
    </table><br></br><br></br>
    <div><button className="btn btn-primary" onClick={handleNewChat}>Create new chat</button></div><br></br>
    <div><button className="btn btn-danger" style={{marginBottom: '20px'}} onClick={navigateBlockList}>Block list</button></div></div>
    
  )
}

export default Chat