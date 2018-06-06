'use strict';
module.exports = (sequelize, DataTypes) => {
  var playlistsongs = sequelize.define('playlistsongs', {
    playlist_id: DataTypes.INTEGER
  }, {});
  playlistsongs.associate = function(models) {
    // associations can be defined here
  };
  return playlistsongs;
};