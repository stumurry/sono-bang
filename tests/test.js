var common = require("./common");

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe("top", function () {
    beforeEach(function () {
       console.log("running something before each test");
    });
    // importTest("a", './aws/aws-s3-access.test.js');

    // routes
    importTest("b", './routes/composer-routes-test.js');
    // importTest("c", './routes/me-routes-test.js');

    // services
    // importTest("d", './services/composer-test.js');
    // importTest("e", './services/me-test.js');
    // importTest("f", './services/producer-test.js');

    //utils

    // importTest("g", './utils/encryption-test.js');

    after(function () {
        console.log("after all tests");
    });
});