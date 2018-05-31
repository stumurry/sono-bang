'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Up(queryInterface),
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};

async function Up(queryInterface) {
  await queryInterface.bulkInsert('users', [
    { id: 1, email:'s@s.com', name: 'Test Composer', username: 'test', password: 'asdfasdf', CreatedAt: new Date(), UpdatedAt: new Date() },
    

  ], {});
  await queryInterface.bulkInsert('composers', [
    { id: 1, name: 'Test Composer',  user_id:1, description:'Test Composer used for testing purposes', homepage:'https://asdf.com', CreatedAt: new Date(), UpdatedAt: new Date() },
    

  ], {});
}

