const express = require('express');
const users = require('../controllers/users');
const routes = express.Router();

routes.get('/users', users.getAll);
routes.put('/users', users.create);
routes.get('/users/check', users.check);
routes.post('/users/login', users.login);

routes.get('/health', (req, res) => {
	res.send();
});

module.exports = routes;
