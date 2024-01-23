const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware')

blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => next(error));
});

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

blogsRouter.post('/', middleware.tokenExtractor, async (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    content: body.content,
    important: body.important || false,
    user: request.user._id
  });

  blog.save()
    .then(savedBlog => {
      response.json(savedBlog);
    })
    .catch(error => next(error));
});

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const updatedBlog = {
    content: body.content,
    important: body.important,
  };

  Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});

module.exports = blogsRouter;