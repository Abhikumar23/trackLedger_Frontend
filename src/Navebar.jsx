import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";


export default function Navbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
const location = useLocation();

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


  return (
    <nav className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-y-4 md:gap-0 px-4 md:px-6 py-4 
                bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
                rounded-xl shadow-lg w-full">
      
      {/* Logo Section */}
      <button onClick={handleLogoClick} className="flex items-center gap-2 text-center md:text-left cursor-pointer">
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
              <linearGradient id="gradientStroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
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

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 text-sm md:text-base">
<button onClick={handleHomeClick}
  
  className="flex items-center font-bold hover:shadow-2xl transition duration-300 cursor-pointer"
>
  <span className="text-xl">🏠</span>
  <span className="ml-1 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-md">
    Home
  </span>
</button>

        <Link to="/transactions" className="flex items-center font-bold hover:shadow-2xl transition duration-300">
          <span className="text-xl">💰</span>
          <span className="ml-1 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-md">Bills</span>
        </Link>

        <Link to="/activities" className="flex items-center font-bold hover:shadow-2xl transition duration-300">
          <span>📋</span>
          <span className="ml-1 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-md">Activity</span>
        </Link>

        <Link
          to={user ? "/profile" : "/login"}
          className="flex items-center border border-gray-400 rounded-full py-2 px-4 gap-2 shadow-md hover:shadow-2xl transition duration-300 shadow-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 overflow-hidden">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>

          <div className="text-white rounded-full border bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>

          {!!user && (
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent font-semibold">
              {user.name}
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
}
