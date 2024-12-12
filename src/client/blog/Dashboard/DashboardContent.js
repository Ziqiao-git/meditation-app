import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DashboardContent = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const userDataScript = document.getElementById('user-data');
    if (userDataScript) {
      const data = JSON.parse(userDataScript.textContent);
      setUser(data.user);
      setPosts(data.posts);
    }
  }, []);

  const handlePostClick = (postId) => {
    window.location.href = `/blog/${postId}`;
  };

  const handleDelete = async (e, postId) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/blog/${postId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPosts(posts.filter(post => post.id !== postId));
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Meditation Journal</h1>
            <p className="text-gray-600">Your personal space for mindful reflections</p>
          </motion.div>
          
          <div className="flex gap-4">
            <motion.a
              href="/blog/new"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                       text-white rounded-lg shadow-md hover:shadow-lg 
                       transition-all duration-300 flex items-center"
            >
              <span className="mr-2">✨</span>
              Create New Entry
            </motion.a>
            <motion.a
              href="/blog/explore"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-purple-500 border-2 
                       border-purple-500 rounded-lg shadow-md hover:shadow-lg 
                       transition-all duration-300 flex items-center"
            >
              <span className="mr-2">🌎</span>
              Explore
            </motion.a>
          </div>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                onClick={() => handlePostClick(post.id)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer 
                         transform transition-all duration-300 hover:shadow-xl 
                         relative group"
              >
                {post.Images && post.Images[0] && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.Images[0].imageUrl}
                      alt="Post cover"
                      className="w-full h-full object-cover transform hover:scale-105 
                               transition-transform duration-300"
                    />
                    {post.Images.length > 1 && (
                      <div className="absolute bottom-2 right-2 flex space-x-1">
                        {post.Images.slice(1, 4).map((image, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded-md overflow-hidden border-2 
                                     border-white shadow-md"
                          >
                            <img
                              src={image.imageUrl}
                              alt={`Preview ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {post.Images.length > 4 && (
                          <div className="w-12 h-12 rounded-md bg-black bg-opacity-50 
                                       flex items-center justify-center text-white 
                                       border-2 border-white shadow-md">
                            +{post.Images.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 
                             hover:text-purple-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3" 
                     dangerouslySetInnerHTML={{ __html: post.content }}>
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {post.latitude && post.longitude && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <span className="mr-1">📍</span>
                          Location added
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <motion.button
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 
                           rounded-full opacity-0 group-hover:opacity-100 
                           transition-opacity duration-200 z-10
                           hover:bg-red-600"
                  onClick={(e) => handleDelete(e, post.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/blog/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 
                       to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl 
                       transition-all duration-300"
            >
              ✨ Create Your First Entry
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;