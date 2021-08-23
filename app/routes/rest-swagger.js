const router = require('express').Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'REST API for Spotify Challenge',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from the Spotify API.',
  },
  servers: [
    {
      url: 'http://localhost:3000/rest',
      description: 'Development server',
    },
  ],
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./routes/rest/*.js'],
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
