import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const[isOpen , setIsOpen]= useState(false);

  const handleHomeClick = () => {
    if (user) {
      if (location.pathname === "/") {
        navigate("/home");
      } else {
        navigate("/home");
      }
    } else {
      navigate("/");
    }
  };
  const handleLogoClick = () => {
    if (user) {
      if (location.pathname === "/") {
        navigate("/home");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const handleSidebar=()=>{
    setIsOpen(!isOpen);
  }

  return (
    <div>

    <div
     className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-y-4 md:gap-0 px-4 md:px-6 py-4 
                bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
                 shadow-lg w-full "
    >
             <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 text-center md:text-left cursor-pointer"
        >
          <span className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:shadow-2xl transition duration-400 drop-shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              fill="none"
              stroke="url(#gradientStroke)"
              className="w-10 h-10"
            >
              <defs>
                <linearGradient
                  id="gradientStroke"
                  x1="0"
                  y1="0"
                  x2="24"
                  y2="24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9333ea" />
                  <stop offset="0.5" stopColor="#ec4899" />
                  <stop offset="1" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 9h3.75m-4.5 2.625h4.5M12 18.75 9.75 16.5h.375a2.625 2.625 0 0 0 0-5.25H9.75m.75-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 drop-shadow-md">
            TrackLedger
          </span>
        </button>

        {/*  */}

    <button onClick={handleSidebar} className="flex items-center border cursor-pointer border-gray-400 rounded-full py-1 px-4 gap-2 shadow-md hover:shadow-2xl transition duration-300 shadow-gray-400">
    <div className="flex items-center justify-end gap-3">
      {/* Menu Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-7 h-7 text-white bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-1 rounded-md shadow-md"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>

      {/* User Avatar */}
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 
               0a9 9 0 1 0-11.963 0m11.963 
               0A8.966 8.966 0 0 1 12 21a8.966 
               8.966 0 0 1-5.982-2.275M15 
               9.75a3 3 0 1 1-6 0 3 3 0 
               0 1 6 0Z"
          />
        </svg>
      </div>
      
      {/* Show user name if logged in */}
      {user && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent font-semibold">
          {user.name}
        </div>
      )}
    </div>
  </button>
    </div>
  

    { isOpen &&(
      <nav
        className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
                   shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-2xl"
      >
        {/* Close button */}
        <div className="flex justify-between items-center p-6 border-b border-purple-500/30">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Navigation
          </h2>
          <button
            onClick={handleSidebar}
            className="text-white hover:text-purple-300 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-6 border-b border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 
                       0a9 9 0 1 0-11.963 0m11.963 
                       0A8.966 8.966 0 0 1 12 21a8.966 
                       8.966 0 0 1-5.982-2.275M15 
                       9.75a3 3 0 1 1-6 0 3 3 0 
                       0 1 6 0Z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-white font-semibold text-lg">{user.name}</div>
                <div className="text-purple-300 text-sm">Logged in</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <ul className="flex flex-col p-6 space-y-4">
          <li>
            <button
              onClick={() => {
                handleHomeClick();
                setIsOpen(false);
              }}
              className="flex items-center w-full p-3 rounded-lg font-bold hover:bg-purple-800/30 transition duration-300 cursor-pointer"
            >
              <span className="text-2xl mr-3">🏠</span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-md text-lg">
                Home
              </span>
            </button>
          </li>

          <li>
            <Link
              to="/transactions"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full p-3 rounded-lg font-bold hover:bg-purple-800/30 transition duration-300"
            >
              <span className="text-2xl mr-3">💰</span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-md text-lg">
                Bills
              </span>
            </Link>
          </li>

          <li>
            <Link
              to="/activities"
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full p-3 rounded-lg font-bold hover:bg-purple-800/30 transition duration-300"
            >
              <span className="text-2xl mr-3">📋</span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-md text-lg">
                Activity
              </span>
            </Link>
          </li>

          <li>
            <Link
              to={user ? "/profile" : "/login"}
              onClick={() => setIsOpen(false)}
              className="flex items-center w-full p-3 rounded-lg font-bold hover:bg-purple-800/30 transition duration-300 border border-purple-500/50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-md text-lg">
                {user ? "Profile" : "Login"}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    )}

    {/* Overlay to close sidebar when clicking outside */}
    {isOpen && (
      <div
      className="fixed inset-0 bg-opacity-50 z-40"
        onClick={handleSidebar}
      ></div>
    )}
    </div>
  );
}