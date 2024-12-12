import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Editor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [editor] = useState(() => new Editor({
    extensions: [
      StarterKit.configure({
        // Disable all formatting options
        bold: false,
        italic: false,
        strike: false,
        code: false,
        heading: false,
        bulletList: false,
        orderedList: false,
        taskList: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your meditation journey...'
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none'
      }
    }
  }));

  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (location) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: location.lat, lng: location.lng },
        zoom: 15
      });
      
      new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map
      });
    }
  }, [location]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', editor.getHTML());
    
    if (location) {
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
    }

    if (images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    try {
      const response = await fetch('/blog', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        window.location.href = '/blog';
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full text-4xl font-bold mb-8 border-none focus:outline-none 
                     placeholder-gray-300 bg-transparent"
          />

          {/* Toolbar */}
          <div className="flex items-center space-x-4 mb-6 border-b border-gray-100 pb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = async (e) => {
                  const files = Array.from(e.target.files);
                  setImages([...images, ...files]);
                };
                input.click();
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              🖼️ Add Image
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setLocation({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    });
                  });
                }
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              📍 Add Location
            </motion.button>
          </div>

          {/* Editor */}
          <EditorContent editor={editor} />

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white 
                             rounded-full p-1 hover:bg-opacity-70"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Location Display */}
          {location && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <span>📍 Location added</span>
                <button
                  onClick={() => setLocation(null)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <div id="map" className="h-48 mt-2 rounded-lg"></div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg"
              onClick={() => window.history.back()}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                       text-white rounded-lg shadow-md"
              onClick={handleSubmit}
            >
              Publish
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost; 