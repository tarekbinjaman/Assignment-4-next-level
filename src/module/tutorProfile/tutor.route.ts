import express from "express";
import * as TutorController from "./tutor.controller";
import { authenticateUser } from "../../middleware/authenticate";

const router = express.Router();

router.post("/", authenticateUser, TutorController.createTutor);
router.get("/", TutorController.getTutors);
router.get("/:id", TutorController.getTutor);
router.patch("/:id", authenticateUser, TutorController.updateTutor);

export default router;
