var { chai, expect, composerUtil } = require("../common");

describe("Encryption", function() {
  describe("Composer", function() {
    it("should encrypt and decrypt message", function() {
      var message = {
        first_name: 'Miles',
        last_name: 'Davis',
        instrument: 'Trumpet',
        birth_year: 1926,
        albums: [
          {title: 'Birth of the Cool', year: 1957},
          {title: 'Bitches Brew', year: 1970}
        ]
      }
      // var message = 'Hello World';
      var encryptedMessage = composerUtil.encrypt(message);
      var decryptedMessage = composerUtil.decrypt(encryptedMessage);
      console.log('** Results');
      console.log(message);
      console.log(encryptedMessage);
      console.log(decryptedMessage);


      
      // expect(message).to.be.equal(decryptedMessage, 'Unable to encrypt message');
    });
  });
});

