import React from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, toggleLike, handleDelete }) => {
  return (
    <li>
      <div>
        <strong>{blog.title}</strong> by {blog.author}
        <button onClick={toggleLike}>Like</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
  toggleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Blog;
