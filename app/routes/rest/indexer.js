const router = require('express').Router();
const SpotifyAPI = require('../../libraries/spotify');
const Track = require('../../models/track');
const { isValidISRC } = require('../../utilities/isrc');

/**
 * @openapi
 * tags:
 *   - name: Indexer
 *     description: Indexing operations
 */

/**
 * @openapi
 * /indexer/track/{isrc}:
 *   post:
 *     summary: Index a track from the Spotify API
 *     tags: [Indexer]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isrc
 *         description: ISRC of track to index
 *         in: path
 *         required: true
 *         type: string
 *         example: USEE10001992
 *     responses:
 *       201:
 *         description: Track indexed successfully
 *       400:
 *         description: Invalid ISRC supplied
 *       422:
 *         description: Failed to index track
 */
router.post('/track/:isrc', async (req, res) => {
  const { isrc } = req.params;
  if (!isValidISRC(isrc)) {
    res.status(400).send();
    return;
  }

  try {
    const data = await SpotifyAPI.findTrackByISRC(isrc);
    if (!data) {
      throw new Error(`No track found for ISRC ${isrc}`);
    }

    const {
      name: title,
      artists,
      album: {
        images: [{ url: image = null } = {}],
      },
    } = data;

    const [track] = await Track.findOrBuild({ where: { isrc } });
    Object.assign(track, {
      title,
      artist: artists.map(({ name }) => name).join(', '),
      image,
      data,
    });
    await track.save();

    res.status(201).send();
  } catch (error) {
    console.warn(error);
    res.status(422).send();
  }
});

module.exports = router;
