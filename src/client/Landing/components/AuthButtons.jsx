import React from 'react';

const AuthButtons = ({ isLoggedIn, username }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="space-x-6">
        {isLoggedIn ? (
          <a 
            href="/users/logout"
            className="inline-block px-8 py-3 text-white bg-rose-500 
                     rounded-full font-medium
                     shadow-lg hover:shadow-xl
                     hover:bg-rose-600 
                     transform hover:scale-105
                     transition-all duration-300
                     text-center"
          >
            Logout
          </a>
        ) : (
          <>
            <a 
              href="/users/login"
              className="inline-block px-8 py-3 text-white bg-emerald-500 
                       rounded-full font-medium
                       shadow-lg hover:shadow-xl
                       hover:bg-emerald-600
                       transform hover:scale-105
                       transition-all duration-300
                       text-center"
            >
              Login
            </a>
            <a 
              href="/users/register"
              className="inline-block px-8 py-3 text-white bg-indigo-500 
                       rounded-full font-medium
                       shadow-lg hover:shadow-xl
                       hover:bg-indigo-600
                       transform hover:scale-105
                       transition-all duration-300
                       text-center"
            >
              Register
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthButtons;