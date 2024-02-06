import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog, toggleShowAll }) => {
  const location = useLocation();
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    createBlog({
      title,
      author,
      url,
    });

    setTitle('');
    setAuthor('');
    setUrl('');

    navigate('/')
  };

  const isBlogFormVisible = location.pathname === '/' || location.pathname === '/create';

  if (!isBlogFormVisible) {
    return null;
  }

  return (
    <Form className='container' onSubmit={handleCreateBlog}>
      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control type="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Form.Text className="text-muted">
          Get started with your blog✨😊
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formAuthor">
        <Form.Label>Author</Form.Label>
        <Form.Control type="author" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formUrl">
        <Form.Label>URL</Form.Label>
        <Form.Control type="url" placeholder="Url" value={url} onChange={(e) => setUrl(e.target.value)} />
      </Form.Group>
      <Button variant="outline-success" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default BlogForm;