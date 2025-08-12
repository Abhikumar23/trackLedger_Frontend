import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = enter email, 2 = OTP, 3 = new password

  const sendOtp = async () => {
    try {
      const res = await axios.post('https://track-ledger-backend.vercel.app/api/reset-password/send-otp', { email });
      toast.success("✅ please check your email");
      toast.success(res.data.message);
      if (res.data.success) setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    }
  };

const verifyOtp = async () => {
  try {
    const res = await axios.post('https://track-ledger-backend.vercel.app/api/reset-password/verify-otp', {
      email,
      otp
    });
    toast.success(res.data.message);
    
    if (res.data.success) setStep(3);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error verifying OTP');
  }
};


  const resetPassword = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/reset-password/reset-password', {
        email,
        otp,
        password
      });
      toast.success(res.data.message);
      if (res.data.success) window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-600 min-h-screen 
                    py-6 px-4 flex items-center justify-center mt-2 rounded-xl">
      <div className="bg-gradient-to-r from-green-100 via-gray-300 to-blue-300 shadow-xl rounded-xl p-8  max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Reset Password</h1>

        <div className="space-y-4">
          {/* Step 1: Email Input */}
          {step >= 1 && (
            <input
              type="email"
              placeholder="xyz@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={step > 1}
              required
            />
          )}

          {step === 1 && (
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              onClick={sendOtp}
              disabled={!email}
            >
              Send OTP
            </button>
          )}

          {/* Step 2: OTP Input */}
          {step >= 2 && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled={step > 2}
            />
          )}

          {step === 2 && (
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              onClick={verifyOtp}
              disabled={!otp}
            >
              Verify OTP
            </button>
          )}

          {/* Step 3: New Password Input */}
          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                onClick={resetPassword}
                disabled={!password}
              >
                Reset Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
