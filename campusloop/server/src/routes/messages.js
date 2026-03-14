import express from "express";
import { prisma } from "../index.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/conversations", authRequired, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true }
        },
        receiver: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const map = new Map();

    for (const message of messages) {
      const otherUser =
        message.senderId === req.user.id ? message.receiver : message.sender;

      if (!map.has(otherUser.id)) {
        map.set(otherUser.id, {
          user: otherUser,
          lastMessage: message
        });
      }
    }

    res.json(Array.from(map.values()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.get("/:userId", authRequired, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id }
        ]
      },
      orderBy: { createdAt: "asc" }
    });

    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: req.user.id,
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ error: "receiverId and content are required" });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        content: content.trim()
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.post("/report", authRequired, async (req, res) => {
  try {
    const { reportedUserId, messageId, reason, note } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Reason is required" });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: req.user.id,
        reportedUserId: reportedUserId || null,
        messageId: messageId || null,
        reason,
        note: note || null
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

export default router;