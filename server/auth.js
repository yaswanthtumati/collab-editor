const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("./supabase");

const router = express.Router();

const JWT_SECRET = "mysecretkey";

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("users").insert({
    username,
    password: hashedPassword,
  });

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  res.json({
    message: "User created",
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    return res.status(400).json({
      error: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET
  );

  res.json({
    token,
    username: user.username,
  });
});

module.exports = router;