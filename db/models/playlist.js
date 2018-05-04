"use strict";
module.exports = (sequelize, DataTypes) => {
  var playlist = sequelize.define("playlist", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    
  }, {
      timestamps: false
  });
  playlist.associate = function(models) {
    // associations can be defined here
  };
  return playlist;
};