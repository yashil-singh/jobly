import { REGEX_URL } from "../lib/constants.js";
import { errorResponse, successResponse } from "../lib/utils.js";
import { db } from "../index.js";
const labels = ["website", "github", "linkedin"];

export const addSocialLink = async (req, res) => {
  try {
    const { label, link } = req.body;
    const userId = req.user?.id;

    if (!label || !link) {
      return errorResponse(res, "Label and link are required.", 400);
    }

    if (!labels.includes(label))
      return errorResponse(res, "Invalid label.", 400);

    if (!REGEX_URL.test(link)) {
      return errorResponse(res, "Invalid URL format.", 400);
    }

    const user = db.get("users").find({ id: userId }).value();

    const existingLinks = user.socialLinks || [];

    const added = existingLinks.some((item) => item.label === label);

    if (added) return errorResponse(res, "Link already exists.", 400);

    const updatedLinks = [...existingLinks, { label, link }];

    db.get("users")
      .find({ id: userId })
      .assign({ socialLinks: updatedLinks })
      .write();

    successResponse(res, { socialLinks: updatedLinks }, "Link added.");
  } catch (error) {
    console.log("🚀 ~ userController.js:26 ~ error:", error);

    errorResponse(res);
  }
};

export const removeSocialLink = async (req, res) => {
  try {
    const { label } = req.params;
    const userId = req.user?.id;

    if (!label) {
      return errorResponse(res, "Label is required.", 400);
    }

    if (!labels.includes(label))
      return errorResponse(res, "Invalid label.", 400);

    const userDb = db.get("users").find({ id: userId });

    const user = userDb.value();

    const existingLinks = user.socialLinks || [];

    const updatedLinks = existingLinks.filter((item) => item.label !== label);

    userDb.assign({ socialLinks: updatedLinks }).write();

    successResponse(res, { socialLinks: updatedLinks }, "Link removed.");
  } catch (error) {
    console.log("🚀 ~ userController.js:67 ~ error:", error);

    errorResponse(res);
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name) return errorResponse(res, "Name is required.", 400);

    const userId = req.user?.id;
    const userDb = db.get("users").find({ id: userId });
    const user = userDb.value();

    const updatedUser = {
      ...user,
      name,
      bio,
    };

    userDb.assign(updatedUser).write();

    req.user = updatedUser;

    successResponse(
      res,
      { user: updatedUser },
      "Profile updated successfully."
    );
  } catch (error) {
    errorResponse(res);
  }
};
