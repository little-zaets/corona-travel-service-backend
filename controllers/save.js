const db = require("../modules/db").db; // .db assigns exported module object exported from db.js

export const save = (req, res) => {
const { data } = req.body;
	db.transaction((trans) => {
		trans("saved")
			.insert({
				search_result: data,
				email: req.jwt.email
			})
			.then(() => {
				return res.json({ 'result': 'success' })
			})
			.then(trans.commit)
			.catch((err) => {
				console.log(err);
				trans.rollback;
			});
	})
}