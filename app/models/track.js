const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utilities/db');

class Track extends Model {
  /**
   * @property {string[]} visibleAttributes - Track attributes to return
   */
  static visibleAttributes = ['isrc', 'title', 'artist', 'image'];

  /**
   * @property {string[]} searchableAttributes - Searchable track attributes
   */
  static searchableAttributes = ['artist', 'title'];
}

Track.init({
  isrc: {
    type: DataTypes.CHAR(12),
    allowNull: false,
    unique: 'isrc',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Track',
});

Track.sync();

module.exports = Track;
