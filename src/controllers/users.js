const User = require('../models/user');

class Users {

	getAll(req, res) {
		User.find()
			.then(users => res.json(users))
			.catch(err => res.status(500).json(err));
	}

	async create(req, res) {
		const newUser = new User(req.body);
		try {
			const createdUser = await newUser.save();
			res.status(201).json(createdUser);
		} catch(err) {
			res.status(400).json(err);
		}
	}

}

module.exports = new Users();
