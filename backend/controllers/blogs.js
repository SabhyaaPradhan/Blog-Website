const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { tokenExtractor } = require('../utils/middleware');

blogsRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => res.json(blogs));
});

blogsRouter.get("/:id", tokenExtractor, (req, res, next) => {
  Blog.findById(req.params.id)
    .then((blog) => {
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

blogsRouter.post("/", tokenExtractor, async (req, res, next) => {
  const { title, author, url } = req.body;

  if (!title || !author || !url) {
    return res.status(400).json({ message: 'Title, author, and URL are required' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    user: req.user._id,
  });

  blog.save()
    .then(savedBlog => {
      res.json(savedBlog);
    })
    .catch(error => next(error));
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    important: body.important,
  };

  Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog);
    })
    .catch(error => next(error));
});

module.exports = blogsRouter;