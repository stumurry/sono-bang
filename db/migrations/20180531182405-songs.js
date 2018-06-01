'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {

  await queryInterface.addColumn('songs', 'composer_id', { type: Sequelize.INTEGER, allowNull: false  });
  await queryInterface.addConstraint('songs', ['composer_id'], {
    type: 'foreign key',
    name: 'song_composer_fkey_constraint',
    references: { //Required field
      table: 'composers',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  await queryInterface.addColumn('songs', 'genre', { type: Sequelize.STRING });
}

async function Down(queryInterface, Sequelize) {
  await queryInterface.removeConstraint('songs', 'song_composer_fkey_constraint');
  await queryInterface.removeColumn('songs', 'composer_id');
  await queryInterface.removeColumn('songs', 'genre');
}