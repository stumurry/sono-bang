'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {
  await queryInterface.addColumn('playlist', 'name', { type: Sequelize.STRING });
 
}

async function Down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('playlist', 'name');
 
}
