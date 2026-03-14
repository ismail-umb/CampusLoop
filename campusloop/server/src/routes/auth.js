import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../index.js";
import { sendVerificationEmail } from "../utils/email.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

function isUmbEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@umb\.edu$/i.test(email);
}

function createVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!isUmbEmail(email)) {
      return res.status(400).json({ error: "Only @umb.edu emails are allowed" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existing) {
      return res.status(409).json({ error: "Account already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const code = createVerificationCode();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        verificationCode: code,
        verificationExpiry: expiry
      }
    });

    await sendVerificationEmail(user.email, code);

    res.status(201).json({
      message: "Signup successful. Verification code sent to your @umb.edu email."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.verificationCode || !user.verificationExpiry) {
      return res.status(400).json({ error: "No verification pending" });
    }

    if (new Date() > user.verificationExpiry) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpiry: null
      }
    });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Verification failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Verify your email before logging in" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: "Account suspended" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    const code = createVerificationCode();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: code,
        verificationExpiry: expiry
      }
    });

    await sendVerificationEmail(user.email, code);

    res.json({ message: "Verification code resent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not resend code" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      isVerified: req.user.isVerified,
      profile: req.user.profile
    }
  });
});

export default router;