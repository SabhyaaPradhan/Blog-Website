const express = require('express');
const mongoose = require('mongoose');
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware');
const app = express();
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const logger = require('./utils/logger');
const config = require('./utils/config');

mongoose.set('strictQuery', true);
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to mongodb'))
  .catch(() => logger.error('Couldn\'t connect to mongodb'));

app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.end('Welcome to my application');
})

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
// Inside your backend route handling blogs
app.put('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.likes += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error('Error updating likes:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.use(errorHandler);
app.use(unknownEndpoint);
module.exports = app;