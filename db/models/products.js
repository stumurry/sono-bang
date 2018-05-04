"use strict";
module.exports = (sequelize, DataTypes) => {
  var products = sequelize.define(
    "products",
    {
      item_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      product_name: { type: DataTypes.STRING },
      department_name: { type: DataTypes.STRING },
      price: { type: DataTypes.DECIMAL(10, 2) },
      stock_quantity: { type: DataTypes.INTEGER }
    },
    {
      timestamps: false
    }
  );
  products.associate = function(models) {
    // associations can be defined here
  };
  return products;
};
