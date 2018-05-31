var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "s",
    pass: "s"
  }
});

const mailOptions = {
  from: "s", // sender address
  to: "s", // list of receivers
  subject: "Subject of your email", // Subject line
  html: "<p>Your html here</p>" // plain text body
};

transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });