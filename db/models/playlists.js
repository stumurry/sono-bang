'use strict';
module.exports = (sequelize, DataTypes) => {
  var playlists = sequelize.define('playlists', {
    name: DataTypes.STRING,
    description : DataTypes.STRING,
    genre : DataTypes.STRING,
    composer_id : DataTypes.INTEGER
  }, {});
  playlists.associate = function(db) {
    // associations can be defined here
  };
  return playlists;
};