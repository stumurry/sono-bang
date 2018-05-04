'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {
  await queryInterface.addColumn('products', 'product_name', { type: Sequelize.STRING });
  await queryInterface.addColumn('products', 'department_name', { type: Sequelize.STRING });
  await queryInterface.addColumn('products', 'price', { type: Sequelize.DECIMAL(10,2) });
  await queryInterface.addColumn('products', 'stock_quantity', { type: Sequelize.INTEGER });
}

async function Down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('products', 'product_name');
  await queryInterface.removeColumn('products', 'department_name');
  await queryInterface.removeColumn('products', 'price');
  await queryInterface.removeColumn('products', 'stock_quantity');
}
