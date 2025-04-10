import { db } from "../index.js";

import { REGEX_EMAIL } from "../lib/constants.js";
import { comparePassword, generateToken, hashPassword } from "../lib/utils.js";
import cookie from "cookie";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim())
      return res.status(400).json({ message: "All fields are required." });

    if (!REGEX_EMAIL.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const users = db.get("users");

    const existingUser = users.find({ email }).value();
    if (existingUser) {
      return res.status(400).json({ message: "Account already exists." });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      bio: "",
      socialLinks: [],
    };
    users.push(newUser).write();

    const token = await generateToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      bio: newUser.bio,
      socialLinks: newUser.socialLinks,
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    res.status(201).json({
      message: "Account created.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        socialLinks: newUser.socialLinks,
      },
    });
  } catch (error) {
    console.log("🚀 ~ authController.js:22 ~ error:", error);

    res.status(500).json({ message: "Something went wrong! Try again." });
  }
};

export const login = async (req, res, router) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim())
      return res.status(400).json({ message: "All fields are required." });

    const users = db.get("users");

    const existingUser = users.find({ email }).value();

    if (!existingUser) {
      return res.status(400).json({ message: "Account not found." });
    }

    const validPassword = await comparePassword(
      password,
      existingUser.password
    );

    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = await generateToken({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      bio: existingUser.bio,
      socialLinks: existingUser.socialLinks,
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    res.status(201).json({
      message: "Logged in.",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        bio: existingUser.bio,
        socialLinks: existingUser.socialLinks,
      },
    });
  } catch (error) {
    console.log("🚀 ~ authController.js:22 ~ error:", error);

    res.status(500).json({ message: "Something went wrong! Try again." });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  });

  res.status(200).json({ message: "Logged out." });
};

export const userData = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({ user });
  } catch (error) {
    console.log("🚀 ~ authController.js:122 ~ error:", error);

    res.status(500).json({ message: "Something went wrong! Try again." });
  }
};
