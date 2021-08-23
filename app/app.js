require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

// REST API
app.use('/rest', require('./routes/rest'));

// REST API Documentation
app.use('/rest-docs', require('./routes/rest-swagger'));

// 404 Catch-all
app.use((req, res) => {
  res.status(404).send('Not found');
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(400).send('Bad request');
});

const port = process.env.NODE_DOCKER_PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
