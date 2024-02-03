import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

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
          <Card.Text>Likes: {likes || 0}</Card.Text>
          <Button variant="primary" onClick={toggleLike}>Like</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
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