// require("dotenv").config();
// var keys = require("../keys.js");


process.env.NODE_ENV = "test";
// For assert operation, please refer to this link:
// https://www.w3schools.com/nodejs/ref_assert.asp
var assert = require("assert");
var customerService = require("../services/CustomerService");

describe("Customer View", function() {
  // Need to connect before executing queries
  // before(function() {
  //   customerService.Connect();
  // });

  after(function() {
    customerService.Disconnect();
  });

  describe("#Products Test", function() {
    var createdId = 0;
    it("should be able to add product", function(done) {
      // Wait for database operation to finish
      // otherwise Disonnect will called too soon causing Sequelize to crash.
      console.log('create product');
      var product = {
        //item_id, // Auto Generaterated
        product_name : 'Test Product',
        department_name : 'Test Department',
        price :  3.14,
        stock_quantity: 1
      }
      customerService.CreateProduct(product, true)
      .then(p => { 
        createdId = p.item_id;
        console.log(createdId)
        // console.log('Testing product')
        // try{
          if (p.product_name !=  product.product_name) throw 'product_name not setup correctly';
          if (p.department_name !=  product.department_name) throw 'department_name not setup correctly';
          console.log(p.price);
          console.log(product.price);
          if (p.price !=  product.price) throw 'price not setup correctly';
          if (p.stock_quantity !=  product.stock_quantity) throw 'stock_quantity not setup correctly';
        // } catch(err) {
        //   assert.fail(err);
        // }
        
        done();
      })
      .catch(err => { 
        console.log(err);
        assert.fail('Unable to create product'); 
        done();
      })
    });

    it("should list products", function(done) {
      // Wait for database operation to finish
      // otherwise Disonnect will called too soon causing Sequelize to crash.

      console.log(customerService)
      customerService.ListProducts().then(users => {
        console.log("Listing products");
        // console.log(JSON.stringify(users));
        console.log(JSON.stringify(users[0]));
        
        users.length == 0
          ? assert.fail("List must be greater than zero")
          : done();
      }).catch(err => { 
        console.log(err);
        assert.fail('Unable to list products'); 
        done();
      });
    });

    it("should delete product", function(done) {
      // Wait for database operation to finish
      // otherwise Disonnect will called too soon causing Sequelize to crash.

      console.log('deleting id=' + createdId);
      customerService.DeleteProduct({ item_id: createdId })
      .then(() => done())
      .catch(err => { 
        console.log(err);
        assert.fail('Unable to delete productid=' + createdId); 
        done();
      });
    });

  });
});
