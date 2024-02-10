import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogService';

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const fetchedBlog = await blogService.getSingleBlog(id);
        setBlog(fetchedBlog);
      } catch (error) {
        console.error('Error fetching blog details:', error.message);
        setBlog(null);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleLike = async () => {
    try {
      await blogService.likeBlog(id);
      const updatedBlog = { ...blog, likes: (blog.likes || 0) + 1 };
      setBlog(updatedBlog);
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!blog) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>URL: {blog.url}</p>
      <p>Likes: {parseInt(blog.likes)}</p>
      <button onClick={handleLike}>Like</button>
    </div>
  );
};

export default SingleBlog;
