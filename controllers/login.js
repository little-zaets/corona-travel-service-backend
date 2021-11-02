//ORM
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const db = require("../modules/db").db; // .db assigns exported module object exported from db.js
require("dotenv").config();

const secretKey = process.env.SECRET_KEY; //one secret key per module

export const login = (req, res) => {
  //user data is held in req.body
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Please fill all fields");
  }
  db("login")
    .select("email", "hash")
    .where({ email })
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where({ email })
          .then((user) => {
            //jwt payload uses email as unique identifier:
            const payload = { email };
            const token = jwt.sign(payload, secretKey, {
              expiresIn: "1h"
            });
            console.log("token", token);
            res.cookie("auth", token, {
              maxAge: 900000,
              sameSite: "None",
              secure: true
            });
            res.status(200).json({ user: user[0], token: token });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json("Could not fulfill request");
          });
      } else {
        res.status(404).send("Incorrect password");
      }
    })
    .catch((err) => {
      res.status(404).send("Incorrect credentials were provided");
    });
};
