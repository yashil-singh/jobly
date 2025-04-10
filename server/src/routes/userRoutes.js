import express from "express";

import {
  addSocialLink,
  editProfile,
  removeSocialLink,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/social-links", addSocialLink);
router.patch("/profile", editProfile);
router.delete("/social-links/:label", removeSocialLink);

export default router;
