'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {
  await queryInterface.addColumn('composers', 'ispaid', { type: Sequelize.BOOLEAN , allowNull: true });
}

async function Down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('composers', 'ispaid');

}

