const md5 = require("md5");
const User = require("../models/user");
const config = require("../config/env/index");
const jwt = require("jsonwebtoken");
const ERROR_DUPLICATE_VALUE = 11000;
const DURATION_60D = 60 * 60 * 24 * 60 * 1000;

class Users {
  getAll(req, res) {
    User.find({ username: new RegExp(req.query.username || "", "i") })
      .select(["username", "avatar", "bio"])
      .limit(10)
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  }

  async getUser(req, res) {
    try {
      const user = await user
        .findById(req.params.id)
        .select(["username", "bio", "avatar", "createdAt"]);

      if (!user) {
        res.sendStatus(404);
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async check(req, res) {
    const { username, email } = req.query;

    if (!username && !email) {
      res.sendStatus(400);
      return;
    }
    let property = email ? "email" : "username";

    try {
      const isExist = await User.exists({
        [property]: req.query[property],
      });
      res.json(isExist);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  async create(req, res) {
    const newUser = new User(req.body);
    newUser.password = md5(newUser.password);
    try {
      const createdUser = await newUser.save();
      res.status(201).json(createdUser);
    } catch (err) {
      if (err.code === ERROR_DUPLICATE_VALUE) {
        res.sendStatus(409);
        return;
      }
      res.status(400).json(err);
    }
  }

  async login(req, res) {
    const credentials = req.body;
    try {
      const user = await User.findOne({
        username: credentials.username,
        password: md5(credentials.password),
      });
      if (!user) {
        res.sendStatus(401);
        return;
      }
      const token = jwt.sign({ id: user._id }, config.secret);
      res.cookie(config.cookieName, token, {
        maxAge: DURATION_60D,
        httpOnly: true,
      });
      res.json(user).send();
    } catch (err) {
      res.sendStatus(500);
    }
  }

  me(req, res) {
    res.json(req.user);
  }
  async getPosts(req, res) {
    try {
      const posts = await posts
        .find({ user: req.params.id })
        .populate("user", ["avatar", "username"])
        .sort({ createdAt: req.query.sort || 1 });
      res.json(posts);
    } catch (err) {
      res.sendStatus(400);
    }
  }
}

module.exports = new Users();
