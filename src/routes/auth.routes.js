import express from "express";
import { login, signup, logout } from "#controllers/auth.controller.js";
import { authRateLimiter } from "#middleware/auth-rate-limiter.js";

const router = express.Router();

router.post("/login", authRateLimiter, login);

router.post("/signup", authRateLimiter, signup);

router.post("/logout", logout);

export default router;