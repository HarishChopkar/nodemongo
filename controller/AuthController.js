const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.json({
        error: err,
      });
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
    });
    user
      .save()
      .then((user) => {
        res.json({
          message: "User Added Successfully!!!",
        });
      })
      .catch((error) => {
        res.json({
          message: "An error occured while registeration",
        });
      });
  });
};

const login = (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  // Submit email or phone as username it will search in database user exist or not
  User.findOne({ $or: [{ email: username }, { phone: username }] }).then(
    (user) => {
      // if user existed it will search with the encrypted password
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.json({
              error: err,
            });
          }

          if (result) {
            // sent username with token
            let token = jwt.sign(
              { name: user.name },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
              }
            );
            let refreshtoken = jwt.sign(
              { name: user.name },
              process.env.REFRESH_TOKEN_SECRET,
              {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
              }
            );
            res.json({
              message: "Login Successfully!",
              token,
              refreshtoken,
            });
          } else {
            res.json({
              message: "Password does not matched",
            });
          }
        });
      } else {
        res.json({
          message: "No user found",
        });
      }
    }
  );
};

const refreshToken = (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    function (err, decode) {
      if (err) {
        res.status(400).json({
          err,
        });
      } else {
        let token = jwt.sign(
          { name: decode.name },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
          }
        );
        let refreshToken = req.body.refreshToken;
        res.status(200).json({
          message: "Token refreshed successfully!",
          token,
          refreshToken,
        });
      }
    }
  );
};

module.exports = {
  register,
  login,
  refreshToken,
};
