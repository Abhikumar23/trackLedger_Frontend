import React from 'react'
import {Link} from "react-router-dom";
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import { Eye, EyeOff } from "lucide-react";

import {useContext} from "react";
import {UserContext} from "../UserContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const navigate= useNavigate();

  const{setUser}= useContext(UserContext);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      'https://track-ledger-backend.vercel.app/api/user/login',
      {
        email,
        password,
      },
      {
        withCredentials: true, // ✅ Important: send cookies
      }
    );

    const { status, user } = response.data;

    if (status === 'pass ok') {
      setUser(user);  
      toast.success("Logged in successfully!");
      navigate('/home');
    } else if (status === 'not found') {
      toast.error("User not found!");
    } else if (status === 'password not ok') {
      toast.error("Password not ok!");
    } else {
      alert("❗ Unexpected server response");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    toast.error(`Invalid credentials!`);
  }
};



  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-600 min-h-screen 
                    mt-2 py-6 px-4 flex items-center justify-center rounded-xl">
      <div className="bg-gradient-to-r from-green-100 via-gray-300 to-blue-300 shadow-xl rounded-xl p-8  max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="xyz@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
<div className="relative w-full">
  <input
    type={visible ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    autoComplete="current-password"
    className="w-full px-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />
  <button
    type="button"
    onClick={() => setVisible((prev) => !prev)}
    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
  >
    {visible ? <Eye size={18} /> : <EyeOff size={18} />}
  </button>
</div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Login
          </button>
          <div  className="text-center hover:text-blue-600">
            <Link to ="/reset-password">Password Reset</Link>
          </div>
         <div className="text-center hover:text-blue-600 py-2">
          Don't have an account yet? <Link to={`/register`} className="underline text-black">Register Now</Link>
        </div>
        </form>
      </div>
    </div>
  );
}
