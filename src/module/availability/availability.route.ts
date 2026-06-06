import express from "express";
import * as AvailabilityController from "./availability.controller";
import { authenticateUser } from "../../middleware/authenticate";

const router = express.Router();

router.post("/", authenticateUser, AvailabilityController.createAvailAbility);
router.get("/", authenticateUser, AvailabilityController.getMyAvailability);
router.patch("/:id", authenticateUser, AvailabilityController.updateAvailability);
router.delete("/:id", authenticateUser, AvailabilityController.deleteAvailability);

export default router;
