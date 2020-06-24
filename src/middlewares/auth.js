function auth(req, res, next) {
	console.log(req.cookies);
	res.sendStatus(400);
}

module.exports = auth;
