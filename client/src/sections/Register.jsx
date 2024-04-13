import React, { useEffect, useState } from 'react'
import httpClient from '../httpClient'

function Register() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const registerUser = async () => {

        if (!isValidEmail(email)) {
            console.error('Invalid email format');
            return; 
        }
        
        try {
          const resp = await httpClient.post("//localhost:8000/register", { email, password });
          window.location.href = "/";  
        } catch (error) {
          if (error.response) {
            if (error.response.status === 409) {
              console.error('Registration failed: User already exists');
            } else {
              console.error('An unexpected error occurred:', error.response.data);
            }
          } else {
            console.error('An unexpected error occurred:', error.message);
          }
        }
      };
      



  return (
    <div className='' >
        <form className='h-[100vh] w-screen flex flex-col justify-center items-center gap-6' >
                <img src="/images/disney-plus-logo.png" alt="" className='w-[300px] md:w-[400px]'/>
                <input onChange={(e)=> setEmail(e.target.value)} type="email" placeholder='E-mail' className='bg-[#31333e] text-[18px] md:text-[20px] rounded-md h-[55px] w-[80vw] sm:w-[380px] md:w-[450px] lg:w-[500px] p-5 text-white outline-gray-400 outline-[1px]' />
                <input onChange={(e)=> setPassword(e.target.value)} type="password" placeholder='Password' className='bg-[#31333e] text-[18px] md:text-[20px] rounded-md h-[55px] w-[80vw] sm:w-[380px] md:w-[450px] lg:w-[500px]  p-5 text-white outline-gray-400 outline-[1px]' />
                <button type='button' onClick={ () => registerUser() } className='flex justify-center items-center text-white text-[18px] md:text-[20px] rounded-md h-[55px] w-[80vw] md:w-[450px] sm:w-[380px] lg:w-[500px]  p-5 bg-[#0072d2] font-normal' >Register</button>
                {/* <button onClick={googleLogin}  className='flex justify-center items-center gap-2 text-white text-[18px] md:text-[20px] rounded-md h-[55px] w-[80vw] md:w-[400px] sm:w-[380px]  p-5 bg-[#0072d2] font-normal' >
                    <img src="/images/google.png" alt="" className='w-8 h-8' />
                    <p>Login with Google</p>
                </button> */}
        </form>
    </div>
  )
}

export default Register