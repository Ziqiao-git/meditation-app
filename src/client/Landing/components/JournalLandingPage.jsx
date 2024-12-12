import React, { useState, useEffect } from 'react';
import AuthButtons from './AuthButtons';

const JournalLandingPage = ({ isLoggedIn }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className={`max-w-4xl mx-auto px-4 py-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Med World</h1>
          <p className="text-lg text-gray-600">
            Document your meditation journey, one moment at a time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2">Reflection Journal</h2>
            <p className="text-gray-600">Capture your thoughts and insights during meditation practice.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📸</div>
            <h2 className="text-xl font-semibold mb-2">Visual Memories</h2>
            <p className="text-gray-600">Add photos to remember your peaceful moments and special places.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📍</div>
            <h2 className="text-xl font-semibold mb-2">Location Stories</h2>
            <p className="text-gray-600">Mark and revisit places that bring you tranquility.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-semibold mb-4">Your Meditation Journey</h2>
          <div className="space-y-4 text-gray-600">
            <p>✨ Write down your meditation experiences</p>
            <p>🌅 Share photos of peaceful moments</p>
            <p>🗺️ Track locations that inspire mindfulness</p>
            <p>📅 Build a personal diary of your practice</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {/* {isLoggedIn ? (
            <a 
              href="/users/logout"
              className="px-8 py-3 bg-red-500 text-white rounded-full 
                       hover:bg-red-600 transform hover:scale-105 
                       transition-all duration-300 shadow-lg"
            >
              Logout
            </a>
          ) : (
            <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
              <a 
                href="/users/login"
                className="px-8 py-3 bg-green-500 text-white rounded-full 
                         hover:bg-green-600 transform hover:scale-105 
                         transition-all duration-300 shadow-lg"
              >
                Start Your Journal
              </a>
              <a 
                href="/users/register"
                className="px-8 py-3 bg-blue-500 text-white rounded-full 
                         hover:bg-blue-600 transform hover:scale-105 
                         transition-all duration-300 shadow-lg"
              >
                Create Account
              </a>
            </div>
          )} */
            <AuthButtons isLoggedIn={isLoggedIn} />

          }
        </div>

        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">Document your meditation journey, share your experiences, and grow mindfully.</p>
        </div>
      </div>
    </div>
  );
};

export default JournalLandingPage;