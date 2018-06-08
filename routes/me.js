var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");

const composerService = require("../services/ComposerService");
const composerUtil = require("../utils/ComposerUtil");

router.get("/login", (req, res, next) => {
  res.render("login", {});
});

router.get("/test", (req, res, next) => {
  res.redirect("https://google.com");
});

// Place login using `me` role so a producer can login maybe in the future.
router.post(
  "/login",
  [
    check(
      "username",
      "please enter a username or username length must be at least 3 characters"
    ).isLength({ min: 3 }),
    check(
      "password",
      "please enter a password or password length must be at least 3 characters"
    ).isLength({ min: 3 })
  ],
  async (req, res, next) => {
    try {
      console.log("start validating...");
      console.log(req.body);

      const errors = validationResult(req);

      console.log(errors.mapped());

      if (!errors.isEmpty()) {
        console.log("has errors");
        console.log(errors.mapped());
        return res
          .status(422)
          .render("login", { errors: errors.mapped(), body: req.body });
      } else {
        console.log("Getting Composer");
        var c = await composerService.GetComposer(
          req.body.username,
          req.body.password
        );

        if (!c.user) {
          console.log("username/login failed");
          res.status(422).render("login", {
            errors: {
              server: { msg: "username/login failed.  Please try again." }
            }
          });
        } else {
          console.log('Encrypting token...');
          var token = composerUtil.encrypt(c);

          res.redirect("/composer/" + token);
        }
      }
    } catch (ex) {
      console.log("server error");
      console.log(ex);
      res.status(422).render("login", {
        errors: {
          server: {
            msg: "Server Error.  Please try again later or contact support."
          }
        }
      });
    }
  }
);

router.get("/register", (req, res, next) => {
  res.render("register", {});
});

router.post(
  "/register",
  [
    // General error messages can be given as a 2nd argument in the check APIs
    check("username", "username must be at least 3 chars long").isLength({
      min: 3
    }),

    check("email")
      // Every validator method in the validator lib is available as a
      // method in the check() APIs.
      // You can customize per validator messages with .withMessage()
      .isEmail()
      .withMessage("email must a valid email.")

      // Every sanitizer method in the validator lib is available as well!
      .trim()
      .normalizeEmail(),

    // ...or throw your own errors using validators created with .custom()
    // .custom(value => {
    //   return findUserByEmail(value).then(user => {
    //     throw new Error("this email is already in use");
    //   });
    // }),

    // General error messages can be given as a 2nd argument in the check APIs
    check("password", "passwords must be at least 3 chars long").isLength({
      min: 3
    }),

    check("name", "name must be at least 3 chars long").isLength({ min: 3 })
  ],
  (req, res, next) => {
    console.log("body");
    console.log(req.body);
    // Get the validation result whenever you want; see the Validation Result API for all options!
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("validation errors");
      // console.log(errors.mapped());
      console.log(errors.mapped());
      // return res.status(422).json({ errors: errors.mapped() });

      return res
        .status(422)
        .render("register", { errors: errors.mapped(), body: req.body });
    }

    var composer = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    };

    return composerService.CreateComposer(composer).then(d => {
      return res.redirect("/me/login");
    });
  }
);

router.get("/profile/:key", async (req, res, next) => {
  try {
    var key = req.params.key;
    k = composerUtil.decrypt(key);

    var profile = await composerService.GetProfile(k.composer, k.user);

    return res.render("profile", {
      key: key,
      profile: profile
    });
  } catch (ex) {
    console.log("Oops, authentication failed.");
    console.log(ex);
    return res.redirect("/me/login");
  }
});

module.exports = router;
