import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'

const Signin = () => {
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[error,setError]=useState('')

    const navigate = useNavigate()

    const {signIn, user} = UserAuth()
  useEffect(() => {
     if(user){
            navigate('/account')
     }
    }, [])
    const handelSubmit = async (e) =>{
        e.preventDefault()
        setError('')
        try{
            await signIn(email,password)
            navigate('/account')
        }catch(e){
            setError(e.message)
            console.log(error)
            alert('Invalid email or password')
        }
    }
  return (
      <div className="text-center">
<div className=' text-center mx-auto my-16 p-4'>
<div>
  <h1 className='text-2xl font-bold py-2'>Log in to your account</h1>
  <p className='py-2'>Don't have an account yet?<Link to='/signup' className='underline'>Create here</Link> </p>
</div>
</div>
<form className='text-center' onSubmit={handelSubmit}>
  <div className='flex flex-col py-2'>
    <label className='py-2 font-medium'>Email address </label>
    <input onChange={(e) =>setEmail(e.target.value)} className='border p-3' type="email"/>
  </div>
  <div className='flex flex-col py-2'>
    <label className='py-2 font-medium'>Password </label>
    <input onChange={(e) =>setPassword(e.target.value)} className='border p-3' type="password"/>
  </div>
  <button className=' btn btn-primary w-full p-4 my-2'>Log in</button>
</form>
<Link to="/passwordreset">Forgot Password?</Link>
    </div>
  )
}

export default Signin