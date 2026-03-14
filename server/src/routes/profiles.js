import express from "express";
import { prisma } from "../index.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

function computeMatchScore(a, b) {
  let score = 0;

  if (!a || !b) return 0;

  const overlap =
    Math.max(0, Math.min(a.budgetMax, b.budgetMax) - Math.max(a.budgetMin, b.budgetMin));

  if (overlap > 0) score += 25;
  if (a.cleanliness === b.cleanliness) score += 20;
  if (a.sleepSchedule === b.sleepSchedule) score += 15;
  if (a.studyHabits === b.studyHabits) score += 15;
  if (a.smokingAllowed === b.smokingAllowed) score += 10;
  if (a.guestsOkay === b.guestsOkay) score += 5;
  if (a.petsOkay === b.petsOkay) score += 5;

  const leaseDiff = Math.abs(a.leaseDurationMonths - b.leaseDurationMonths);
  if (leaseDiff <= 3) score += 5;

  return Math.min(score, 100);
}

router.post("/", authRequired, async (req, res) => {
  try {
    const data = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: {
        ...data
      },
      create: {
        ...data,
        userId: req.user.id
      }
    });

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.get("/browse", authRequired, async (req, res) => {
  try {
    const {
      minBudget,
      maxBudget,
      cleanliness,
      sleepSchedule,
      studyHabits,
      leaseDurationMonths,
      petsOkay,
      smokingAllowed
    } = req.query;

    const myProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    const filters = {
      user: {
        isVerified: true,
        isSuspended: false
      },
      NOT: {
        userId: req.user.id
      }
    };

    if (minBudget) filters.budgetMax = { gte: Number(minBudget) };
    if (maxBudget) filters.budgetMin = { lte: Number(maxBudget) };
    if (cleanliness) filters.cleanliness = cleanliness;
    if (sleepSchedule) filters.sleepSchedule = sleepSchedule;
    if (studyHabits) filters.studyHabits = studyHabits;
    if (leaseDurationMonths) filters.leaseDurationMonths = Number(leaseDurationMonths);
    if (petsOkay !== undefined && petsOkay !== "") filters.petsOkay = petsOkay === "true";
    if (smokingAllowed !== undefined && smokingAllowed !== "") filters.smokingAllowed = smokingAllowed === "true";

    const profiles = await prisma.profile.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const enriched = profiles.map((profile) => ({
      ...profile,
      matchScore: myProfile ? computeMatchScore(myProfile, profile) : null
    }));

    enriched.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to browse profiles" });
  }
});

export default router;