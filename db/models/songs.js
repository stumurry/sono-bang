'use strict';
module.exports = (sequelize, DataTypes) => {
  var songs = sequelize.define('songs', {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    playlist_id : DataTypes.INTEGER,
    composer_id : DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    bucket: DataTypes.STRING,
    key: DataTypes.STRING,
    genre : DataTypes.STRING,

  }, {});
  songs.associate = function(db) {
    // associations can be defined here
    // db.songs.belongsTo(db.playlists, {
    //   foreignKey: {
    //     allowNull: false
    //   }
    // });
  };
  return songs;
};