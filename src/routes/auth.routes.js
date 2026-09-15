import express from "express";
import { signup } from "#controllers/auth.controller.js";

const router = express.Router();

router.post("/login", (req, res) => {
  // Handle login logic here
  res.send("Login route");
});

router.post("/signup", signup);

router.post("/logout", (req, res) => {
  // Handle logout logic here
  res.send("Logout route");
});

export default router;