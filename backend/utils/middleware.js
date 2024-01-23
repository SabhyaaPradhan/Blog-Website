const logger = require('./logger')
const User = require('../models/user')
const jwt = require("jsonwebtoken")

const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
}

const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if(authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tokenExtractor = async (request, response, next) => {
  try {
    const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    request.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return response.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
};
