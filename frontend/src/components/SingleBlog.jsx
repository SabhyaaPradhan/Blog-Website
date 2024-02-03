import blogService from '../services/blog';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

  if (!blog) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>URL: {blog.url}</p>
      <p>Likes: {blog.likes}</p>
    </div>
  );
};

export default SingleBlog;
