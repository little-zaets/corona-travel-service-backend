import bcrypt from 'bcrypt';
const db = require('../modules/db').db; // .db assigns exported module object exported from db.js

export const register = (req, res) => {
  //user data is held in req.body
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send('Please fill all fields');
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .send('Password is required and should be at least 6 characters long');
	}
	
	const hash = bcrypt.hashSync(password, 12);
	
  //using transaction instead of db to automaticaly commit and rollover
	db.transaction((trans) => {
    trans("login")
      .insert({
        hash: hash,
        email: email
      })
      .returning("email")
      .then((loginEmail) => {
        return trans("users")
          .insert({
            email: loginEmail[0],
            name: name
          })
          .returning("*")
          .then((user) => {
            res.json({ user: user[0] });
          });
      })
      .then(trans.commit)
      .catch((err) => {
        console.log(err);
        trans.rollback;
      });
	})
		.catch((err) => {
    	console.log(err);
    	res.status(404).send("Unable to register");
  });
};