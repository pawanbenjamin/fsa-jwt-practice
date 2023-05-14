const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  try {
    const token = jwt.sign({ username, password }, "shhhh");
    res.send({
      success: true,
      message: "Thanks for signing up!",
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/authenticate", (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(403);
    next({
      message: "Sorry, you are not an authenticated user",
      name: "Unauthorized",
    });
    return;
  }

  const prefix = "Bearer ";
  const token = authorization.slice(prefix.length);
  try {
    const { username, iat } = jwt.verify(token, "shhhh");
    res.send({
      success: true,
      message: `Correctly Authenticated!`,
      data: {
        username,
        iat,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get("*", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.send({
    message: err.message,
    name: err.name,
  });
});

app.listen(8080, () => {
  console.log(`Listening on PORT 8080`);
});
