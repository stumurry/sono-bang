var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");

var Composer = require("../services/ComposerService");

router.get("/login",(req, res, next) => {
    res.render("login", {  });
}); 

router.post("/login",
    [
      check("username")
        .isLength({ min: 1 }),

      check(
        "password",
        "please enter a password"
      )
        .isLength({ min: 5 }),
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // console.log(errors.mapped());
        // console.log(req.body)
        return res
          .status(422)
          .render("register", { errors: errors.mapped(), body: req.body });
      }
      return res.render("register-success");
    }
  );

router.get("/register", (req, res, next) => {
  res.render("register", { });
});

router.post("/register",
  [
    check("username")
      // Every validator method in the validator lib is available as a
      // method in the check() APIs.
      // You can customize per validator messages with .withMessage()
      .isEmail()
      .withMessage("must be an email")

      // Every sanitizer method in the validator lib is available as well!
      .trim()
      .normalizeEmail()

      // ...or throw your own errors using validators created with .custom()
      .custom(value => {
        return findUserByEmail(value).then(user => {
          throw new Error("this email is already in use");
        });
      }),

    // General error messages can be given as a 2nd argument in the check APIs
    check(
      "password",
      "passwords must be at least 5 chars long and contain one number"
    )
      .isLength({ min: 5 })
      .matches(/\d/),

    check("name","a name must be supplied")
    .isLength({ min: 1 })
  ],
  (req, res, next) => {
    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // //   console.log('validation errors');
      // console.log(errors.mapped());
      // console.log(req.body)
      // return res.status(422).json({ errors: errors.mapped() });

      return res
        .status(422)
        .render("register", { errors: errors.mapped(), body: req.body });
    }

    // matchedData returns only the subset of data validated by the middleware
    // const user = matchedData(req);
    // createUser(user).then(user => res.json(user));
    return res.render("register-success");
  }
);

module.exports = router;
