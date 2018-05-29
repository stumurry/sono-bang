'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => Down(queryInterface, Sequelize)
};

async function Up(queryInterface, Sequelize) {

  await queryInterface.addColumn('composers', 'description', { type: Sequelize.STRING , allowNull: true });
  await queryInterface.addColumn('composers', 'homepage', { type: Sequelize.STRING , allowNull: true });

  await queryInterface.addColumn('composers', 'user_id', { type: Sequelize.INTEGER , allowNull: false });

  await queryInterface.addConstraint('composers', ['user_id'], {
    type: 'foreign key',
    name: 'user_composer_fkey_constraint',
    references: { //Required field
      table: 'users',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
  
}

async function Down(queryInterface, Sequelize) {
  // Remove constraint first before removing column
  await queryInterface.removeConstraint('composers', 'user_composer_fkey_constraint');
  await queryInterface.removeColumn('composers', 'user_id');
  await queryInterface.removeColumn('composers','description');
  await queryInterface.removeColumn('composers', 'homepage');

}

