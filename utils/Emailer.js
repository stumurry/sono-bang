var nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var fs = require("fs");
const aws = require("../services/AmazonService");
var keys = require('../keys');

var emailer = {
  sendEmail: async function(email, templatePath, data) {

    // console.log('html');
    // console.log(JSON.stringify(data));

    // Grab html template from file and place data.
    var htmlData = fs.readFileSync(templatePath, { encoding: "utf-8" });

    var template = handlebars.compile(htmlData);
    
    var tmpl = template(data);

    var str = tmpl.replace(/(?:\r\n|\r|\n)/g, '');

    
    // if (template != undefined) console.log(template);
    // else console.log("nothing in here");
    const mailOptions = {
      to: email, // list of receivers
      subject: "A SONOBANG composer would like you to listen!", // Subject line
      html: str
    };

     await aws.SendEmail(mailOptions.to, mailOptions.subject, mailOptions.html);
  }
};

module.exports = emailer;
