import React from 'react';

const SingleBlog = ({ blog }) => {
  if (!blog) {
    return null;
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
