import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { onSnapshot, collection, addDoc} from 'firebase/firestore';
import { firestore } from '../firebase';
import { Avatar } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import BlockIcon from '@mui/icons-material/Block';
import "./chat.css"
import Spinner from './Spinner';

function Privatechat() {
    const chatWindowRef = useRef(null);
    const [text, setText] = useState("");
    const[showPicker, setShowPicker] = useState(false);
    const { state } = useLocation();
    const email = state && state.email;
    const { username, username2 } = useParams();
    const [chat, setChat] = useState([]);
    const [user, setUser] = useState([]);
    const [messages, setMessages] = useState([]);
    const [email2, setEmail2] = useState([]);
    const [profilePic, setProfilePic] = useState([]);
    const [blocked, setBlocked] = useState(false);
    const [blocker, setBlocker] = useState(false);


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
                .filter(doc => doc.data().username === username2)
                .map(doc => ({ ...doc.data(), id: doc.id }));
            setEmail2(c[0].email);
            setProfilePic(c[0].profilePic);
        });

        const unsubscribeChats = onSnapshot(collection(firestore, "chats"), (snapshot) => {
            const chats = snapshot.docs
                .filter((doc) => (doc.data().email1 === email && doc.data().email2 === email2) || (doc.data().email1 === email2 && doc.data().email2 === email))
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

        const userSubscription = onSnapshot(collection(firestore, "users"), snapshot => {
            snapshot.docs.map(doc => {
                if (doc.data().email === email) {
                    setUser(doc.data());
                }
            });
         

        });
    const blockedUsers = onSnapshot(collection(firestore, "blockedUsers"), snapshot => {
        snapshot.docs.map(doc => {
            if (doc.data().blockerEmail === email && doc.data().blockedEmail === email2) {
                setBlocker(true);
            }else if(doc.data().blockerEmail === email2 && doc.data().blockedEmail === email){
                setBlocked(true);
            }
        });
    });

        return () => {
            unsubscribeUsers();
            unsubscribeChats();
            userSubscription();
            blockedUsers();
        };
    }, [email, email2, username2]);

    const handleBackClick = () => {
        window.history.back();
     }

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages])


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
                sender: username,
                senderEmail: email,
                time: new Date(),
                link:""
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

              const payload = { text: "photo", sender: username, time: new Date(), link: url, senderEmail: email}
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
const handleBlock= async()=>{
    const confirm = window.confirm;
     let isConfirmed = confirm("Are you sure you want to block "+username2+"?")
    if(isConfirmed){

    const docRef =collection(firestore, "blockedUsers");
    const payload = {blockerEmail:email,blockedEmail:email2, blockerUsername:username, blockedUsername:username2}
    await addDoc(docRef, payload);
    }

}
    return (

        <div >
            {chat.length === 0 ? (
               <Spinner/>
            ) : (
                blocked  ? ( 
                     <div>
                        <div className="row align-items-start">
                                    <div className="col-3">
                    <button onClick={handleBackClick} className="btn btn-danger">Back</button>

                    </div>
                    <div className="col">
                    <h1 className='text-center'> This user blocked you</h1>
                    </div>
                    </div>
                    </div>
                    ) : (
                        blocker ? (
                            <div className='text-center'>
                                <div className="row align-items-start">
                                    <div className="col-3">
                            <button onClick={handleBackClick} className="btn btn-danger">Back</button>
                            </div>
                            <div className="col-6">
                            <h1 > You blocked this user</h1>
                             </div>
                            </div>
                            <h5>go to block list to unblock this user</h5>
                            
                            </div>
                        ) : (
                    
                <div>
                 
                    <div className="bg-dark text-white container-fluid"><div className="row align-items-start"><div className="col-3"><button onClick={handleBackClick} className="btn btn-danger">Back</button></div><div className="col-6"><h1 className="text-center" >{username2} </h1></div><div className='col-1'></div><div className='col-1'><BlockIcon  onClick={handleBlock}/></div></div></div>
                    <div className="messages-container " ref={chatWindowRef} >
                        <div className="container-fluid" >


                            {messages.filter(c => c.text !== "").sort((a, b) => a.time - b.time).map((message) => (
                                <div key={message.id} className={message.senderEmail === email ? "sent-message" : "received-message"}>
                                    <div className="row justify-content-around">
                                        <div className="col-2">
                                        </div>
                                        <div className="col-10">
                                            <div className="message-bubble ">{message.link==="" ? message.text : <img src={message.link} className="images"></img>}
                                                <p className={message.senderEmail === email ? "timeSender" : "timeReceiver"}> {message.time.toDate().toLocaleTimeString()}</p></div>

                                        </div>
                                        <div className="col-1">
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className={message.senderEmail === email ? "col-11 profpic" : "col-2 profpic"}>
                                            <Avatar 
                                                src={message.senderEmail === email ? user.profilePic : profilePic}
                                                sx={{ width: 50, height: 50, float: 'right' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                            ))

                            }


                        </div>
                    </div>
                  <div className="input-container">
                        <input
                            onChange={(e) => setText(e.target.value)}
                            type="text"
                            value={text}
                            placeholder="Type your message here"
                            className="message-input"
                            id="message-input"
                        />
                        <div className="picker">
                            <div >
                        <Avatar className="emoji-input"  onClick={() => setShowPicker(!showPicker)}>
                          <AddReactionIcon/> </Avatar>
                         <div className="emoji-open">
                          {showPicker && <Picker data={data} onEmojiSelect={handleEmojiClick} />}
                          </div>
                          </div>
                          <div >
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
                           on
                        />
                        <button onClick={handleSend} className="send-button">Send</button>
                        
                    </div>
                </div>
                ) 
                    ) 
            )}
            
        </div>
    )
}

export default Privatechat