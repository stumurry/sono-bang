const db = require('../db/models')
const composerService = require('../services/ComposerService')

module.exports = {
  // Testing purposes only.
  Disconnect: function() {
    return db.sequelize.close();
  },

  Login : async function(username, password) {
    var d = await composerService.GetComposer(username, password);
    
    if (!d.user) {
      throw 'Username or password is not found.'
    } 

    return { user : d.user['dataValues'], composer: d.composer['dataValues']};
  }
};
