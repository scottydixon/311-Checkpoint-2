// need to add more comments

let db = require("../models/db");
let argon2 = require("argon2");
let jsonwebtoken = require("jsonwebtoken");



let login = function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    res.sendStatus(401);
    return;
  }

  let sql = "SELECT id, password_hash FROM users WHERE email = ?";
  let params = [email];

  db.query(sql, params, async function (error, results) {
    if (error) {
      console.log("failed to fetch user info for login", error);
      res.sendStatus(500);
      return;
    } else if (results.length > 1) {
      console.error("found more than 1 row for email");
      res.sendStatus(500);
      return;
    } else if (results.length == 0) {
      res.sendStatus(401);
    } else {
      let userid = results[0].id;
      let hash = results[0].password_hash;

      let passwordMatch = false;
      try {
        passwordMatch = await argon2.verify(hash, password);
      } catch (error) {
        console.error("failed to verify password hash", error);
      }

      if (passwordMatch) {
        let token = {
          userid: userid,
          email: email,
        };
        let signedToken = jsonwebtoken.sign(token, process.env.JWT_SECRET, {
          expiresIn: 3600,
        });
        res.json(signedToken);
        return;
      } else {
        res.sendStatus(401);
        return;
      }
    }
  });
};

module.exports = {
  login
};
