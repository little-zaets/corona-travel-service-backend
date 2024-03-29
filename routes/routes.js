import express from "express";
//import controllers
import { showResponse } from "../controllers/auth";
import { register } from "../controllers/register";
import { login } from "../controllers/login";
import { searchHistory } from "../controllers/searchHistory";
import { save } from "../controllers/save";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY; //one secret key per module

const isAuthenticatedAPI = async (req, res, next) => {
  try {
    //verify and get decoded token in order to send to save function
    const decoded = await jwt.verify(req.cookies.auth, secretKey);
    req.jwt = decoded;
    return next();
  } catch (error) {
    return res.status(401).send("UNAUTHORIZED");
  }
};

const router = express.Router();

router.get('/', (req, res, next) => {
	res.send('API Status: Running');
});

//need post because will receive post request from client
router.post("/register", register);
router.post("/login", login);
router.post("/save", isAuthenticatedAPI, save);

router.get("/checkToken", isAuthenticatedAPI, (req, res) => {
  return res.json(req.body);
});

router.get("/search_history", isAuthenticatedAPI, searchHistory);

router.post("/logout", (req, res) => {
  res.clearCookie("auth");
  return res.json(req.body);
});

//need to use module.exports since 'require' is used to route in server.js
module.exports = router;
