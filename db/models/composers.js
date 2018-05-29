'use strict';
module.exports = (sequelize, DataTypes) => {
  var composers = sequelize.define('composers', {
    name: DataTypes.STRING,
    user_id : DataTypes.INTEGER,
    homepage : DataTypes.STRING,
    description : DataTypes.STRING,
  }, {});
  composers.associate = function(db) {
    // associations can be defined here
  };
  return composers;
};