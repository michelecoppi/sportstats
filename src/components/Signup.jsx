import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import {UserAuth} from '../context/AuthContext'
import {firestore } from '../firebase'
import { addDoc, collection  } from "firebase/firestore";
import validator from 'validator';


const Signup = () => {

  function generateRandomString() {
    let randomString = "";
    for (let i = 0; i < 9; i++) {
      randomString += Math.floor(Math.random() * 10);
    }
    return randomString;
  }



const[email,setEmail]=useState('')
const[password,setPassword]=useState('')
const[error,setError]=useState('')

const {createUser} = UserAuth()
const navigate = useNavigate()

const handleSubmit = async (e) =>{
    e.preventDefault()
    setError('')
    if(validator.isEmail(email)){
    try{
      
       await createUser(email,password)
       let date = new Date();
       let formattedDate = date.toLocaleDateString("en-US", {
         month: "2-digit",
           day: "2-digit",
         year: "numeric"
       });
      
       let formattedDateString = formattedDate.toString();
       
        const payload={email : email, coins: 100, dailyBonus: formattedDateString, username:("user"+generateRandomString()), profilePic: "", weeklyPoints: 0,weeklyMedal: "", idClan:"" }
      await addDoc(collection(firestore, "users"), payload);
     
    
         navigate('/signin')
      
    }catch(e){
     setError(e.message)
     console.log(error)
    }
  }else{
    alert('Invalid email')
  }
}

  return (
    <div>
<div className='text-center mx-auto my-16 p-4'>
<div>
  <h1 className='text-2xl font-bold py-2'>Create your account</h1>
  <p className='py-2'>Do you already have an account?<Link to='/signin' className='underline'>Log in here</Link> </p>
</div>
</div>
<form className='text-center' onSubmit={handleSubmit}>
  <div className='flex flex-col py-2'>
    <label className='py-2 font-medium'>Email address</label>
    <input onChange={(e)=> setEmail(e.target.value)} className='border p-3' type="email"/>
  </div>
  <div className='flex flex-col py-2'>
    <label className='py-2 font-medium'>Password</label>
    <input onChange={(e)=> setPassword(e.target.value)} className='border p-3' type="password"/>
  </div>
  <button className='btn btn-primary w-full p-4 my-2'>Register</button>
</form>
    </div>
  )
}

export default Signup