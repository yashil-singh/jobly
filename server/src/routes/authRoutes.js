import express from "express";
import {
  login,
  logout,
  signup,
  userData,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateToken, userData);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
