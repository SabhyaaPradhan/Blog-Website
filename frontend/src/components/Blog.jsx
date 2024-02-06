import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import LikeButton from '../services/LikeButton';

const Blog = ({ blog, toggleLike, handleDelete }) => {
  if (!blog) {
    return null;
  }

  const { title, author, likes, id } = blog;

  return (
    <li>
      <Card style={{ width: '18rem', margin: '10px' }}>
        <Card.Body>
          <Card.Title>{title || 'Unknown Title'}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">by {author || 'Unknown Author'}</Card.Subtitle>
          <LikeButton />
          <Button variant="outline-danger" onClick={handleDelete}>Delete</Button>
          <Link to={`/blogs/${id}`} className="btn btn-link">View Details</Link>
        </Card.Body>
      </Card>
    </li>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    author: PropTypes.string,
    likes: PropTypes.number,
  }),
  toggleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Blog;