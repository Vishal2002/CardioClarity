import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { HomeIcon, BoltIcon, BellIcon, MoonIcon, HeartIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { GrScorecard } from "react-icons/gr";

const Layout = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/signin');
  };

  const menuItems = [
    { text: 'Home', icon: HomeIcon, path: '/' },
    { text: 'Activity', icon: BoltIcon, path: '/activity' },
    { text: 'Alerts', icon: BellIcon, path: '/alerts' },
    { text: 'Sleep', icon: MoonIcon, path: '/sleep' },
    { text: 'Body', icon: HeartIcon, path: '/body' },
    { text: 'Scoreboard', icon: GrScorecard, path: '/scoreboard' },
  ];

  if (!userData) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gradient-to-br from-purple-100 to-blue-200 flex flex-col">
        <div className="p-4 text-center">
          <div className="w-20 h-20 mx-auto bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-2 text-xl font-semibold">{userData.name}</h2>
          <p className="text-sm text-gray-600">{userData.email}</p>
        </div>
        <nav className="mt-6 flex-grow">
          <ul>
            {menuItems.map((item) => (
              <li className='font-bold text-sm' key={item.text}>
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button 
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out flex items-center justify-center"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gradient-to-br from-purple-100 to-blue-200 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;