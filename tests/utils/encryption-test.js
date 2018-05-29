var { expect, assert } = require("chai");
const ComposerUtil = require('../../utils/ComposerUtil')

var { expect, assert } = require("chai");

describe("Encryption", function() {
  describe("Composer", function() {
    it("should encrypt and decrypt message", function() {
      var message =  "Hello World";
      var encryptedMessage = ComposerUtil.encrypt(message);
      var decryptedMessage = ComposerUtil.decrypt(encryptedMessage);
      expect(message).to.be.equal(decryptedMessage, 'Unable to encrypt message');
    });
  });
});

