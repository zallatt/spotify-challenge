/**
 * @constant {string} AUTH_HEADER - API access token header key
 */
const AUTH_HEADER = 'x-api-access-token';

module.exports = (req, res, next) => {
  const token = req.headers[AUTH_HEADER];
  if (!token) {
    return res.status(401).send();
  }
  const role = token === 'jedigrandmaster' ? 'admin' : 'user';
  req.user = { role };
  return next();
};
