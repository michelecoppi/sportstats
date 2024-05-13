import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Avatar } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import "./chat.css";
import Spinner from '../Spinner';


function Generalchat() {
    const chatWindowRef = useRef(null);
    const location = useLocation();
const email = location.state && location.state.email;
    const [text, setText] = useState("");
    const[showPicker, setShowPicker] = useState(false);
    const [username, setUsername] = useState([]);
    const [emailUsers, setEmail] = useState([]);
    const [profilePicUsers, setProfilePic] = useState([]);
    const [emailUser, setEmailUser] = useState([]);
    const [profilePicUser, setProfilePicUser] = useState([]);
    const [usernameUser, setUsernameUser] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState([]);

    function generateRandomString() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 9; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }

    useEffect(() => {
        const unsubscribeUsers = onSnapshot(collection(firestore, "users"), (snapshot) => {
            const c = snapshot.docs
                .filter(doc => doc.data().email !== email)
                .map(doc => ({ ...doc.data(), id: doc.id }));

            const emails = c.map(user => user.email);
            const profilePics = c.map(user => user.profilePic);
            const usernames = c.map(user => user.username);

            setEmail(emails);
            setProfilePic(profilePics);
            setUsername(usernames);
        });
        const unsubscribeUser = onSnapshot(collection(firestore, "users"), (snapshot) => {
            const c = snapshot.docs
                .filter(doc => doc.data().email === email)
                .map(doc => ({ ...doc.data(), id: doc.id }));



            setEmailUser(c[0].email);
            setProfilePicUser(c[0].profilePic);
            setUsernameUser(c[0].username);

        });

        const unsubscribeChats = onSnapshot(collection(firestore, "chats"), (snapshot) => {
            const chats = snapshot.docs
                .filter((doc) => (doc.data().email1 === "general" && doc.data().email2 === "general"))
                .map((doc) => ({ ...doc.data(), id: doc.id }));

            if (chats.length > 0) {
                const chat = chats[0];
                const messagesRef = collection(firestore, "chats", chat.id, "messages");

                onSnapshot(messagesRef, (snapshot) => {
                    const messages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    setMessages(messages);
                });
            }

            setChat(chats);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeUser();
            unsubscribeChats();
        };
    }, [email])

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages])

    const handleBackClick = () => {
       window.history.back();
    }

 

    const handleSend = () => {
        if (text.trim().length === 0) {
            console.log("Empty message");
        } else if (text.trim().length > 120) {
            alert("too long message")
            document.getElementById('message-input').value = '';
        } else {
            const messagesRef = collection(firestore, "chats", chat[0].id, "messages");
            const message = {
                text,
                sender: usernameUser,
                senderEmail: email,
                time: new Date(),
                link: ""
            };


            addDoc(messagesRef, message);

            document.getElementById('message-input').value = '';

            setText("");


        }

    }


    const handleEmojiClick= ( emoji) => {
     
         setText(text+emoji.native);
      }

      const handleFileChange  = async (e) => {
        const file = e.target.files[0];
        if (e.target.files[0].size > 2000000) {
            alert('Image too big')
          } else {
            let name=generateRandomString();
        const storageRef = ref(storage, `images/${name}`);
        
        await uploadBytes(storageRef, file).then(() => {
            getDownloadURL(storageRef).then((url) => {

              const payload = { text: "photo", sender: usernameUser, time: new Date(), link: url, senderEmail: email}
              const docRef = collection(firestore, "chats", chat[0].id, "messages");
              addDoc(docRef, payload);

            }).catch((error) => {
              console.log(error)
            })

          }).catch((error) => {
            console.log(error)
          })
          }
        }


    return (
        <div>
            {chat.length === 0 ? (
                <Spinner/>
            ) : (
                <div>

                    <div className="bg-dark text-white container-fluid"><div className="row align-items-start"><div className="col-3"><button onClick={handleBackClick} className="btn btn-danger">Back</button></div><div className="col-6"><h1 className="text-center" >Global Chat </h1></div></div></div>
                    <div className="messages-container " ref={chatWindowRef} >
                        <div className="container-fluid" >
                        

                            {messages.filter(c => c.text !== "").sort((a, b) => a.time - b.time).map((message) => (
                                <div key={message.id} className={message.senderEmail === email ? "sent-message" : "received-message"}>

                                    <div className="row justify-content-around">
                                        <div className="col-2">
                                        </div>
                                        <div className="col-10">
                                            {message.senderEmail !== email && (
                                                <div className="username">{message.sender}</div>
                                            )}
                                            <div className="message-bubble ">{message.link==="" ? message.text : <img src={message.link} className="images"></img>}
                                                <p className={message.senderEmail === email ? "timeSender" : "timeReceiver"}> {message.time.toDate().toLocaleTimeString()}</p></div>

                                        </div>
                                        <div className="col-1">
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className={message.senderEmail === email ? "col-11 profpic" : "col-2 profpic"}>
                                            <Avatar
                                                src={message.senderEmail === email ? profilePicUser : profilePicUsers.find((profilePic, index) => emailUsers[index] === message.senderEmail)}
                                                sx={{ width: 50, height: 50, float: 'right' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                            ))

                            }


                        </div>
                      
                    </div>
                    
                    <div className="input-container ">
                        <input
                            onChange={(e) => setText(e.target.value)}
                            type="text"
                            value={text}
                            placeholder="Type your message here"
                            className="message-input"
                            id="message-input"
                        />
                        <div className='picker'>
                            <div>
                            {showPicker && 
                            <div className="emoji-open">
                            <Picker data={data} onEmojiSelect={handleEmojiClick} style={{

                          }} />
                          </div>
                          }
                        <Avatar className="emoji-input"  onClick={() => setShowPicker(!showPicker)}>
                          <AddReactionIcon/> </Avatar>
                         
                         
                          </div>
                          <div>
                        <Avatar
                            className="image-input"
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            <AddPhotoAlternateIcon />
                        </Avatar>
                        </div>
                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <button onClick={handleSend} className="send-button">Send</button>
                    </div>

                </div>
            )}

        </div>
    )
}

export default Generalchat