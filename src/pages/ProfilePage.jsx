import { useContext, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";
import axios from "axios";
import { toast } from 'react-toastify';
import Avatar from 'react-avatar';

export default function ProfilePage() {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  let { subpage } = useParams();

  if (!ready) return "Loading...";
  if (!subpage) subpage = "profile";
  if (ready && !user) return <Navigate to="/" />;
  if (redirect) return <Navigate to={redirect} />;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axios.post(
        "https://track-ledger-backend.vercel.app/api/user/upload",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(res.data.user);
      setFile(null); 
      toast.success("✅ Profile picture updated!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("❌ Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("https://track-ledger-backend.vercel.app/api/user/logout", {}, { withCredentials: true });
      setUser(null);
      setRedirect("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen py-8 px-4 flex justify-center">
      {subpage === "profile" && (
        <div className="w-full max-w-md mx-auto">
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white  mb-2">My Profile</h1>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Profile Image Section */}
            <div className="relative mb-8">
              <div className="relative group">
                <label htmlFor="profileImageInput" className="cursor-pointer block relative">
<div className="relative">
  {user?.profileImage ? (
    <img
      src={user.profileImage} // ✅ Use the Cloudinary URL directly
      alt="Profile"
      className="w-32 h-32 mx-auto rounded-full border-4 border-white/30 shadow-2xl object-cover 
                 transition-all duration-300 group-hover:border-purple-400/50 group-hover:shadow-purple-500/20"
    />
  ) : (
    <Avatar
      name={user?.name || user?.email}
      size="125"
      round={true}
      className="w-32 h-32 mx-auto rounded-full border-4 border-white/30 shadow-2xl object-cover 
                 transition-all duration-300 group-hover:border-purple-400/50 group-hover:shadow-purple-500/20"
    />
  )}

  {/* Overlay on hover */}
  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </div>
</div>
                  <input
                    id="profileImageInput"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                
                {/* Change Photo Badge */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    Click to change
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              {file && (
                <div className="mt-6 space-y-3">
                  <div className="text-center">
                    <span className="text-sm text-gray-300">Selected: {file.name}</span>
                  </div>
                  <button
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isUploading ? 'animate-pulse' : ''
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Profile Image
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="space-y-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-semibold">{user.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </div>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      )}
    </div>
  );
}