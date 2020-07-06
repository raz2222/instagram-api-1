const express = require("express");
const users = require("../controllers/users");
const posts = require("../controllers/posts");
const auth = require("../middlewares/auth");
const multer = require("multer");
const upload = multer({ dest: "public/posts/" });
const routes = express.Router();

routes.get("/users", users.getAll);
routes.put("/users", users.create);
routes.get("/users/check", users.check);
routes.post("/users/login", users.login);
routes.get("/users/me", auth, users.me);

routes.put("/posts", posts.create);

routes.get("/health", (req, res) => {
  res.send();
});

module.exports = routes;
