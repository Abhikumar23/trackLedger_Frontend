import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = enter email, 2 = OTP, 3 = new password
  const [loading, setLoading] = useState(false);

  const backendUrl = 'https://track-ledger-backend.vercel.app/api/reset-password';

  // Step 1: Send OTP
  const sendOtp = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/send-otp`, { email });
      toast.success(res.data.message || "✅ Check your email for OTP");
      if (res.data.success) setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/verify-otp`, { email, otp });
      toast.success(res.data.message || "OTP verified successfully");
      if (res.data.success) setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const resetPassword = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/reset-password`, { email, otp, password });
      toast.success(res.data.message || "Password reset successfully");
      if (res.data.success) window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-600 min-h-screen py-6 px-4 flex items-center justify-center">
      <div className="bg-gradient-to-r from-green-100 via-gray-300 to-blue-300 shadow-xl rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Reset Password</h1>
        <div className="space-y-4">
          {/* Step 1: Email */}
          {step >= 1 && (
            <input
              type="email"
              placeholder="xyz@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={step > 1 || loading}
              required
            />
          )}
          {step === 1 && (
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              onClick={sendOtp}
              disabled={!email || loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}

          {/* Step 2: OTP */}
          {step >= 2 && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled={step > 2 || loading}
            />
          )}
          {step === 2 && (
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              onClick={verifyOtp}
              disabled={!otp || loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                disabled={loading}
              />
              <button
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                onClick={resetPassword}
                disabled={!password || loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
