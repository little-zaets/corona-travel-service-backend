const db = require("../modules/db").db; // .db assigns exported module object exported from db.js

export const searchHistory = async (req, res) => {
  const { data } = req.body;
  const results = await db("saved").select("*").where({ email: req.jwt.email });

  return res.json(results);
};
