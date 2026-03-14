import express from "express";
import { prisma } from "../index.js";
import { authRequired } from "../middleware/auth.js";
import { adminRequired } from "../middleware/admin.js";

const router = express.Router();

router.use(authRequired, adminRequired);

router.get("/reports", async (_req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        reportedUser: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        message: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

router.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: "desc" }
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch("/users/:id/suspend", async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isSuspended: true }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to suspend user" });
  }
});

router.patch("/users/:id/restore", async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isSuspended: false }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to restore user" });
  }
});

router.patch("/reports/:id/resolve", async (req, res) => {
  try {
    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: { resolved: true }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to resolve report" });
  }
});

export default router;