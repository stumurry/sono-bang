'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {
  await queryInterface.addColumn('songs', 'name', { type: Sequelize.STRING });
  await queryInterface.addColumn('songs', 'location', { type: Sequelize.STRING });
  await queryInterface.addColumn('songs', 'description', { type: Sequelize.STRING });
}

async function Down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('songs', 'name');
  await queryInterface.removeColumn('songs', 'location');
  await queryInterface.removeColumn('songs', 'description');
}
