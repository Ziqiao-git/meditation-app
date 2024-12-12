import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ExploreContent = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Explore Mindful Moments</h1>
                    <p className="text-gray-600">Discover meditation experiences shared by the community</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            onClick={() => handlePostClick(post.id)}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer 
                                     transform transition-all duration-300 hover:shadow-xl"
                        >
                            {post.Images && post.Images[0] && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={post.Images[0].imageUrl}
                                        alt="Post cover"
                                        className="w-full h-full object-cover transform hover:scale-105 
                                                 transition-transform duration-300"
                                    />
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
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 
                                                      to-pink-400 flex items-center justify-center 
                                                      text-white text-sm font-bold">
                                            {post.User?.username?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600">
                                            {post.User?.username || 'Anonymous'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExploreContent; 