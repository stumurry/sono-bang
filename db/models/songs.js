'use strict';
module.exports = (sequelize, DataTypes) => {
  var songs = sequelize.define('songs', {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  songs.associate = function(models) {
    // associations can be defined here
  };
  return songs;
};