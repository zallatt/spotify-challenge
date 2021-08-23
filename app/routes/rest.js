const router = require('express').Router();
const acl = require('express-acl');
const rateLimit = require('express-rate-limit');
const apiAuth = require('../middleware/apiAuth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

acl.config({
  baseUrl: '/rest',
  filename: 'acl.json',
  path: 'config',
  defaultRole: 'user',
  decodedObjectName: 'user',
  denyCallback: (res) => res.status(403).send(),
});

router.use(apiAuth, acl.authorize, limiter);

router.use('/tracks', require('./rest/tracks'));
router.use('/indexer', require('./rest/indexer'));

module.exports = router;
