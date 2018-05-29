'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'username', { type: Sequelize.STRING });
  await queryInterface.addColumn('users', 'password', { type: Sequelize.STRING });
  await queryInterface.addColumn('users', 'name', { type: Sequelize.STRING });
}

async function Down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('users', 'username');
  await queryInterface.removeColumn('users', 'password');
  await queryInterface.removeColumn('users', 'name');
}