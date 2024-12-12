import React from 'react';

const LogoutForm = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch('/users/logout');
      if (response.ok) {
        window.location.href = '/';
      } else {
        alert('Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full m-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Logout</h1>
        <p className="text-center text-gray-600 mb-8">Are you sure you want to logout?</p>
        
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-rose-500 text-white rounded-lg font-medium 
                     hover:bg-rose-600 transform hover:scale-[1.02] 
                     transition-all duration-200 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Logout
          </button>
          
          <a 
            href="/"
            className="block text-center py-3 bg-gray-100 text-gray-700 rounded-lg font-medium 
                     hover:bg-gray-200 transform hover:scale-[1.02] 
                     transition-all duration-200"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogoutForm; 