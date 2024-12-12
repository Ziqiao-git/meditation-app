import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Login from './users/login';
import Register from './users/register';
import Logout from './users/logout';
import Dashboard from './blog/Dashboard';
import CreatePost from './blog/Create/CreatePost';
import Explore from './blog/Explore';
import Post from './blog/Post';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/logout" element={<Logout />} />
        <Route path="/blog" element={<Dashboard />} />
        <Route path="/blog/new" element={<CreatePost />} />
        <Route path="/blog/explore" element={<Explore />} />
        <Route path="/blog/:id" element={<Post />} />
      </Routes>
    </Router>
  );
};

export default App;