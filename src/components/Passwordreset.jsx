import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'

const  Passwordreset =() => {

    const[email,setEmail]=useState('')
    const[error,setError]=useState('')

    const {resetPassword, user} = UserAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if(user){
               navigate('/account')
        }
       }, [])

    const handelSubmit = async (e) =>{
        e.preventDefault();

        try{
            await resetPassword(email)
            navigate('/signin')
        }catch(e){
            setError(e.message)
            console.log(error)
        }
    }
  return (
    <div><div>
        <h1 className='text-2xl text-center font-bold py-2'>Reset Password</h1>
        </div>
        <div>
        <form className='text-center' onSubmit={handelSubmit}>
        <div className='flex flex-col py-2'>
        <label className='py-2 font-medium'>Email address</label>
        <input onChange={(e) =>setEmail(e.target.value)} className='border p-3' type="email"/>
        </div>
        <button className=' btn btn-primary w-full p-4 my-2'>Reset Password</button>
        </form>
        </div>
        </div>
  )
}

export default Passwordreset