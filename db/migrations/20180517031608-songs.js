'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {
  await queryInterface.addColumn('songs', 'playlist_id', { type: Sequelize.INTEGER, allowNull: false  });

  await queryInterface.addConstraint('songs', ['playlist_id'], {
    type: 'foreign key',
    name: 'playlists_fkey_constraint',
    references: { //Required field
      table: 'playlists',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
  
}

async function Down(queryInterface, Sequelize) {
  
  await queryInterface.removeConstraint('songs', 'playlists_fkey_constraint');
  await queryInterface.removeColumn('songs', 'playlist_id');

}

