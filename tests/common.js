require("dotenv").config();
const keys = require("../keys.js");

const fs = require("fs");
const uuid = require("node-uuid");
const chai = require("chai");
const path = require('path');
const { request, expect, assert } = require("chai");
const app = require("../app");
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const db = require("../db/models");

const amazonService = require("../services/AmazonService");
const composerService = require("../services/ComposerService");
const meService = require("../services/MeService");
const producerService = require("../services/ProducerService");
const composerUtil = require('../utils/ComposerUtil');

module.exports = {
    amazonService : amazonService,
    aws : amazonService,
    composerService : composerService,
    fs : fs,
    uuid : uuid,
    chai : chai,
    path : path,
    request : request,
    expect : expect,
    assert : assert,
    app : app,
    meService : meService,
    db : db,
    producerService : producerService,
    composerUtil : composerUtil,
}
