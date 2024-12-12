import React from 'react';
import JournalLandingPage from './components/JournalLandingPage';

const Landing = () => {
  const userDataScript = document.getElementById('user-data');
  let isLoggedIn = false;
  let username = null;

  if (userDataScript) {
    const userData = JSON.parse(userDataScript.textContent);
    isLoggedIn = !!userData.user;
    username = userData.user?.username;
  }

  return (
    <JournalLandingPage 
      isLoggedIn={isLoggedIn} 
      username={username} 
    />
  );
};

export default Landing;