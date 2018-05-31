var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "logan.jazzu@gmail.com",
    pass: "Pikeru1212"
  }
});

const mailOptions = {
  from: "logan.jazzu@gmail.com", // sender address
  to: "stuartmurry93@gmail.com", // list of receivers
  subject: "Subject of your email", // Subject line
  html: "<p>Your html here</p>" // plain text body
};

transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });