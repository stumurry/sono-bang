const db = require('../db/models')

module.exports = function() {
  var ProducerService = {
    // Testing purposes only.
    Disconnect: function() {
      console.log("Closing connection...");
      db.sequelize.close();
    }
  };

  return ProducerService;
};
