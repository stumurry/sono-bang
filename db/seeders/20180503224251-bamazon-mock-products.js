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
  await queryInterface.bulkInsert('products', [
    { product_name: 'DAVID YURMAN Women\'s Chatelaine Pendant Necklace w/ 8mm Pearl $325 NEW', department_name: 'Fine Jewelry', price : 194.97, stock_quantity : 2 },
    { product_name: 'Canon EOS 80D 24.2MP Digital SLR Camera - Black (Body Only)', department_name: 'DSLR Cameras', price : 739.99, stock_quantity : 2 },
    { product_name: 'New Canon Rebel T6 SLR Camera Premium Kit w/ 2Lens 18-55& 75-300mm, bag, SD Card', department_name: 'DSLR Cameras', price : 469.00, stock_quantity : 9 },
    { product_name: 'Gucci Bamboo By Gucci 2.5 Oz Eau De Parfum Spray Perfume Women NEW SEALED BOX', department_name: 'Women\'s Fragrances', price : 30, stock_quantity : 4 },

  ], {});
}

async function Down(queryInterface) {
  await queryInterface.bulkDelete('Person', null, {});
}
