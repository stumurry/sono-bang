'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {
  await queryInterface.addColumn('songs', 'fileName', { type: Sequelize.STRING });
  await queryInterface.addColumn('songs', 'bucket', { type: Sequelize.STRING });
  await queryInterface.addColumn('songs', 'key', { type: Sequelize.STRING });
}

async function Down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('songs', 'fileName');
  await queryInterface.removeColumn('songs', 'bucket');
  await queryInterface.removeColumn('songs', 'key');
}