'use strict';
module.exports = (sequelize, DataTypes) => {
  var playlists = sequelize.define('playlists', {
    name: DataTypes.STRING,
    description : DataTypes.STRING
  }, {});
  playlists.associate = function(models) {
    // associations can be defined here
  };
  return playlists;
};