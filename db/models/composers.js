'use strict';
module.exports = (sequelize, DataTypes) => {
  var composers = sequelize.define('composers', {
    name: DataTypes.STRING
  }, {});
  composers.associate = function(db) {
    // associations can be defined here
  };
  return composers;
};