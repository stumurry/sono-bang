'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password : DataTypes.STRING,
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};