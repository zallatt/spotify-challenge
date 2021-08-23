const router = require('express').Router();
const { Op } = require('sequelize');
const Track = require('../../models/track');
const { isValidISRC } = require('../../utilities/isrc');

/**
 * @openapi
 * tags:
 *   - name: Tracks
 *     description: Search tracks indexed from the Spotify API
 */

/**
 * @openapi
 * definitions:
 *   Track:
 *     type: object
 *     properties:
 *       isrc:
 *         type: string
 *         example: USEE10001992
 *       title:
 *         type: string
 *         example: Enter Sandman
 *       artist:
 *         type: string
 *         example: Metallica
 *       image:
 *         type: string
 *         example: "https://i.scdn.co/image/ab67616d0000b273af07dc851962508661bbcfce"
 *   TrackResultList:
 *     type: object
 *     properties:
 *       tracks:
 *         type: array
 *         items:
 *           $ref: "#/definitions/Track"
 *   TrackResult:
 *     type: object
 *     properties:
 *       track:
 *         $ref: "#/definitions/Track"
 */

/**
 * @openapi
 * /tracks:
 *   get:
 *     summary: Retrieve a list of tracks
 *     tags: [Tracks]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: artist
 *         description: Track artist, partial match
 *         in: query
 *         required: false
 *         type: string
 *         example: metal
 *       - name: title
 *         description: Track title, partial match
 *         in: query
 *         required: false
 *         type: string
 *         example: sand
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/definitions/TrackResultList"
 */
router.get('/', async (req, res) => {
  const where = Object.entries(req.query).reduce((conditions, [key, value]) => {
    if (!Track.searchableAttributes.includes(key) || !value) {
      return conditions;
    }
    return {
      ...conditions,
      [key]: { [Op.like]: `%${value}%` },
    };
  }, {});

  const tracks = await Track.findAll({ attributes: Track.visibleAttributes, where })
    .catch((error) => {
      console.warn(error);
      return [];
    });
  res.send({ tracks });
});

/**
 * @openapi
 * /tracks/{isrc}:
 *   get:
 *     summary: Retrieve a track by ISRC
 *     tags: [Tracks]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isrc
 *         description: ISRC of track to return
 *         in: path
 *         required: true
 *         type: string
 *         example: USEE10001992
 *     responses:
 *       200:
 *         description: Track found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/definitions/TrackResult"
 *       400:
 *         description: Invalid ISRC supplied
 *       404:
 *         description: Track not found
 */
router.get('/:isrc', async (req, res) => {
  const { isrc } = req.params;
  if (!isValidISRC(isrc)) {
    res.status(400).send();
    return;
  }

  const track = await Track.findOne({ attributes: Track.visibleAttributes, where: { isrc } })
    .catch((error) => {
      console.warn(error);
      return null;
    });

  if (!track) {
    res.status(404).send();
    return;
  }

  res.send({ track });
});

module.exports = router;
