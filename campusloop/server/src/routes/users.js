import express from "express";
import { prisma } from "../index.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authRequired, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isVerified: true,
        isSuspended: false
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profile: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/:id", authRequired, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;