import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { firestore } from '../firebase'
import { collection, addDoc } from 'firebase/firestore';
import './contact.css';
function Contactus() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const navigate = useNavigate();


    const handleSubmit = (event) => {
      event.preventDefault();
      
       
      const docRef = collection(firestore, "contact");
        const payload = {
            name: name,
            email: email,
            text: message
        }
      addDoc(docRef, payload);
        alert("Thank you for contacting us. We will get back to you soon.");
        navigate('/');
    };

  return (
    <div className="contact-us-container">
    <h1>Contact Us</h1>
    <form>
      <div className="form-group">
        <label htmlFor="name" className="text-center">Name</label>
        <input type="text" className="form-control" id="name" placeholder="Enter your name"  value={name}
            onChange={(event) => setName(event.target.value)}
            required/>
      </div>
      <div className="form-group">
        <label htmlFor="email" className="text-center">Email</label>
        <input type="email" className="form-control" id="email" placeholder="Enter your email"  value={email}
            onChange={(event) => setEmail(event.target.value)}
            required />
      </div>
      <div className="form-group">
        <label htmlFor="message" className="text-center">Message</label>
        <textarea className="form-control message" id="message" rows="5" placeholder="Enter your message" 
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required

></textarea>
      </div>
     <center><button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button></center> 
    </form>
  </div>
);
}

export default Contactus