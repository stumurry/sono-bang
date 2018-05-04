
var db = require("../db/models/index");
var products = require("../db/models/products")(db.sequelize,db.Sequelize);

module.exports = {
  // Used for testing purposes only.  Normall killed with thread on webserver.
  Disconnect: Disconnect,

  // // User
  CreateProduct: CreateProduct,
  ListProducts: ListProducts,
  DeleteProduct: DeleteProduct
};

// Testing purposes only.
function Disconnect() {
  console.log("Closing connection...");
  db.sequelize.close();
}

function ListProducts() {
  return products.findAll();
}

function CreateProduct(product) {
  return products.create(product);
}

function DeleteProduct(product) {
  return products.destroy({ where : product });
}




