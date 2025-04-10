import express from "express";
import {
  applyToJob,
  getAppliedJobs,
  getUserSavedJobs,
  searchJob,
  toggleJobSave,
} from "../controllers/jobController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", authenticateToken, searchJob);

router.get("/saved", authenticateToken, getUserSavedJobs);
router.post("/toggle-save/:id", authenticateToken, toggleJobSave);

router.get("/applied", authenticateToken, getAppliedJobs);
router.post("/apply/:id", authenticateToken, applyToJob);

export default router;
