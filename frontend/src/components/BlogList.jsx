import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function BlogList() {
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [error, setErrorMessage] = useState();

  useEffect(() => {
    const fetchUserBlogs = async (userId) => {
      try {
        const response = await fetch(`/api/blogs/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user-specific blogs');
       }
        const userBlogs = await response.json();
        console.log('User-specific blogs:', userBlogs);
        setBlogs(userBlogs);
      } catch (error) {
        setErrorMessage('Error fetching user-specific blogs: ' + error.message);
      }
    };
    
    fetchUserBlogs(userId);
  }, [userId]);

  return (
    <div>
      <h2>User Blogs</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
