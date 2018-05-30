const db = require('../db/models')

module.exports = {
  // Testing purposes only.
  Disconnect: function() {
    return db.sequelize.close();
  }
};
