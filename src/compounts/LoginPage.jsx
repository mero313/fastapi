import React from 'react';
import { useEffect,useState } from 'react';
import axios from 'axios';
import api from "../api"
// import './login.css';

import login1 from "../assets/logo-part1.svg"
import login2 from "../assets/logo-part2.svg"
import "./login.css"

const LoginPage = () =>{
  
  const [userName,setUserName] = useState(" iam working ")

  useEffect(()=>{
    const sendRequest = async () => {
      try {
        const response = await axios.post("https://localhost:5173/login", { username: userName });
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    sendRequest();
  },[])

  return (
  <div className="login-page flex lg:flex-row flex-col justify-between items-center lg:pt-20 lg:pl-20">
    {/* <img src={require('./images/login.svg')} alt="login_img" className="login-img" /> */}

    <div className="lg:pr-36 flex flex-col items-center lg:ml-10 mb-10">
      <a className="flex flex-row items-center lg:mx-36" href="/"> {/* Update href to your homepage route */}
        <img src={login1} alt="logo" className="logo1" />
        <img src={login2} alt="logo" className="logo2 px-1" />
      </a>
      <span className="line"></span>

      <form action="/login" method="POST" className="pt-4 flex flex-col items-center">
        {/* CSRF token should be handled by your backend or using a library like axios for POST requests */}
        <input
          type="text"
          placeholder="Enter Your Username"
          name="username"
          className="in py-2 pl-2 lg:w-96 w-12/12 focus:outline-blue-500"
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          name="password"
          className="in py-2 pl-2 lg:w-96 w-12/12 mt-4 focus:outline-blue-500"
        />
        <input
          type="submit"
          value="Log in"
          className="mt-4 font-bold login-btn"
        />
      </form>
    </div>
  </div>
);}

export default LoginPage;
