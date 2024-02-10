import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import LikeButton from '../services/LikeButton';

const Blog = ({ blog, handleDelete, handleEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(blog.title || '');
  const [editedContent, setEditedContent] = useState(blog.content || '');

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditedTitle(blog.title || '');
    setEditedContent(blog.content || '');
  };

  const handleEditModalSave = () => {
    handleEdit(editedTitle, editedContent);
    setShowEditModal(false);
  };

  if (!blog) {
    return null;
  }

  const { author, id } = blog;

  return (
    <li>
      <Card style={{ width: '18rem', margin: '10px' }}>
        <Card.Body>
          <Card.Title>{blog.title || 'Unknown Title'}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">by {author || 'Unknown Author'}</Card.Subtitle>
          <LikeButton />
          <Button variant="outline-danger" onClick={handleDelete}>Delete</Button>
          <Button variant="primary" onClick={() => setShowEditModal(true)}>Edit</Button>
        </Card.Body>
      </Card>
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={editedContent}
              onChange={(e) => {
                console.log("Content Changed:", e.target.value);
                setEditedContent(e.target.value);
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>Cancel</Button>
          <Button variant="primary" onClick={handleEditModalSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      <Link to={`/blogs/${id}`} className="btn btn-link">View Details</Link>
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
  handleEdit: PropTypes.func.isRequired, // New prop for handling edit
};

export default Blog;
