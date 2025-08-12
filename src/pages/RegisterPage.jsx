import React from 'react'
import {Link} from "react-router-dom";
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import { Eye, EyeOff } from "lucide-react";

// import {useContext} from "react";
// import {UserContext} from "../UserContext.jsx";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = registration form, 2 = OTP verification
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  // Send OTP when register button is clicked
  async function sendOtpForRegistration(event) {
    event.preventDefault();

    try {
      const response = await axios.post('https://track-ledger-backend.vercel.app/api/user/send-registration-otp', {
        name,
        email,
        password,
      },
       { withCredentials: true }
      );

      toast.success("OTP sent to your email!");
      setStep(2); // Move to OTP verification step

    } catch (error) {
      console.error('OTP sending failed:', error.message);
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    }
  }

  // Verify OTP and complete registration
  async function verifyOtpAndRegister(event) {
    event.preventDefault();

    try {
      const response = await axios.post('https://track-ledger-backend.vercel.app/api/user/verify-otp-and-register', {
        name,
        email,
        password,
        otp,
      },
       { withCredentials: true }
      );

      toast.success("Registered successfully!");
      navigate('/login');

      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setOtp('');
      setStep(1);

    } catch (error) {
      console.error('OTP verification failed:', error.message);
      toast.error(error.response?.data?.message || "OTP verification failed!");
    }
  }

  // Go back to registration form
  const goBackToRegistration = () => {
    setStep(1);
    setOtp('');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-600 min-h-screen 
                    py-6 px-4 flex items-center justify-center mt-2 rounded-xl">
      <div className="bg-gradient-to-r from-green-100 via-gray-300 to-blue-300 shadow-xl rounded-xl p-8 max-w-md w-full">
        
        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Register</h1>
            <form onSubmit={sendOtpForRegistration} className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <input
                type="email"
                placeholder="xyz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
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
                Register
              </button>
              <div className="text-center hover:text-blue-600 py-2">
                Already have an account?{" "}
                <Link to="/login" className="underline text-black">
                  Login Now
                </Link>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Verify OTP</h1>
            <div className="mb-4 text-center text-gray-700">
              <p>We've sent an OTP to:</p>
              <p className="font-semibold text-blue-600">{email}</p>
            </div>
            <form onSubmit={verifyOtpAndRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center text-lg tracking-wider"
                maxLength={6}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Verify OTP & Complete Registration
              </button>
              <button
                type="button"
                onClick={goBackToRegistration}
                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Back to Registration
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}