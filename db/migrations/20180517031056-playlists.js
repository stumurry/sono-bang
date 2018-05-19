'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {

  await queryInterface.addColumn('playlists', 'composer_id', { type: Sequelize.INTEGER , allowNull: false });

  await queryInterface.addConstraint('playlists', ['composer_id'], {
    type: 'foreign key',
    name: 'composers_fkey_constraint',
    references: { //Required field
      table: 'composers',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
  
}

async function Down(queryInterface, Sequelize) {
  // Remove constraint first before removing column
  await queryInterface.removeConstraint('playlists', 'composers_fkey_constraint');
  await queryInterface.removeColumn('playlists', 'composer_id');

}

