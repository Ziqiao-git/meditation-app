import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const PostContent = () => {
    const [post, setPost] = useState(null);
    const [user, setUser] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const mapRef = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        const userDataScript = document.getElementById('user-data');
        if (userDataScript) {
            const data = JSON.parse(userDataScript.textContent);
            setPost(data.post);
            setUser(data.user);
            setComments(data.post.Comments || []);
        }
    }, []);

    useEffect(() => {
        if (post?.latitude && post?.longitude && !mapRef.current) {
            initMap();
        }
    }, [post]);

    const initMap = () => {
        if (!window.google || mapRef.current) return;
        
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: parseFloat(post.latitude), lng: parseFloat(post.longitude) },
            zoom: 15
        });
        
        new google.maps.Marker({
            position: { lat: parseFloat(post.latitude), lng: parseFloat(post.longitude) },
            map: map
        });
        
        mapRef.current = map;
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`/comment/${post.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (response.ok) {
                const comment = await response.json();
                setComments([...comments, comment]);
                setNewComment('');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        }
    };

    if (!post) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {post.Images && post.Images[0] && (
                        <div className="w-full h-96 overflow-hidden">
                            <img 
                                src={post.Images[0].imageUrl}
                                alt="Post cover"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
                            <div className="flex items-center space-x-4 text-gray-600">
                                <span className="flex items-center">
                                    <span className="mr-2">📅</span>
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                {post.latitude && post.longitude && (
                                    <span className="flex items-center">
                                        <span className="mr-2">📍</span>
                                        Location added
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none mb-8"
                             dangerouslySetInnerHTML={{ __html: post.content }}>
                        </div>

                        {post.Images && post.Images.length > 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                {post.Images.slice(1).map((image, index) => (
                                    <motion.div
                                        key={index}
                                        className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <img
                                            src={image.imageUrl}
                                            alt={`Post image ${index + 2}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {post.latitude && post.longitude && (
                            <div className="border-t border-gray-100 pt-8 mt-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location</h2>
                                <div id="map" className="w-full h-[400px] rounded-xl overflow-hidden"></div>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8"
                >
                    <div className="p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h2>
                        
                        {user ? (
                            <form onSubmit={handleSubmitComment} className="mb-8">
                                <div className="flex gap-4">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        className="flex-1 p-3 border border-gray-200 rounded-lg 
                                                 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows="3"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                                                 text-white rounded-lg shadow-md hover:shadow-lg 
                                                 transition-all duration-300 h-fit"
                                    >
                                        Post
                                    </motion.button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-gray-600 mb-8">Please log in to comment.</p>
                        )}

                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border-b border-gray-100 pb-6 last:border-0"
                                >
                                    <div className="flex items-center mb-2">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r 
                                                      from-purple-400 to-pink-400 flex items-center 
                                                      justify-center text-white text-sm font-bold">
                                            {comment.User?.username?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <span className="ml-2 font-medium text-gray-700">
                                            {comment.User?.username || 'Anonymous'}
                                        </span>
                                        <span className="ml-4 text-sm text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 ml-10">{comment.content}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center"
                >
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/blog"
                        className="inline-block px-6 py-3 bg-white text-purple-500 border-2 
                                 border-purple-500 rounded-lg shadow-md hover:shadow-lg 
                                 transition-all duration-300"
                    >
                        ← Back to Posts
                    </motion.a>
                </motion.div>
            </div>
        </div>
    );
};

export default PostContent; 