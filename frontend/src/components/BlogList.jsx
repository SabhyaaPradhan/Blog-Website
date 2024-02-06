import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await fetch(`/blogs/${id}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          console.error('API response is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching user blogs:', error.message);
      }
    };

    fetchUserBlogs();
  }, [id]);

  return (
    <div>
      <h2>User Blogs</h2>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
