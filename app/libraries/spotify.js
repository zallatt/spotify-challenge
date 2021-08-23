const axios = require('axios');

/**
 * @constant {string} credentials - Base64-encoded Spotify client credentials
 */
const credentials = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_KEY}`).toString('base64');

/**
 * Get Spotify access token
 *
 * @returns {string} Spotify access token
 * @see {@link https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow|Client Credentials Flow}
 */
const getAccessToken = () => {
  const url = 'https://accounts.spotify.com/api/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${credentials}`,
  };
  return axios.post(url, params, { headers }).then(({ data }) => {
    const { access_token: accessToken, token_type: tokenType } = data;
    return `${tokenType} ${accessToken}`;
  });
};

/**
 * Search for an item using the Spotify API
 *
 * @param {object} params - Query parameters
 * @returns {Promise.<object>} Promise of search results object
 * @see {@link https://developer.spotify.com/documentation/web-api/reference/#category-search|Search API}
 */
const search = async (params = {}) => {
  const accessToken = await getAccessToken();
  const url = 'https://api.spotify.com/v1/search';
  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    Authorization: accessToken,
  };
  return axios.get(url, { headers, params }).then(({ data }) => data);
};

/**
 * Search for a track by ISRC using the Spotify API
 *
 * @param {string} isrc - Track ISRC
 * @returns {Promise.<?object>} - Promise to track object or null if none found
 */
const findTrackByISRC = async (isrc) => {
  const params = {
    q: `isrc:${isrc}`,
    type: 'track',
  };
  return search(params).then((data) => {
    const { tracks: { items: tracks } } = data;
    tracks.sort((trackA, trackB) => trackB.popularity - trackA.popularity);
    return tracks[0];
  }).catch((error) => {
    console.warn(error);
    return null;
  });
};

module.exports = {
  findTrackByISRC,
  search,
};
