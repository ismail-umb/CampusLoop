import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

export async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: "Account suspended" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}