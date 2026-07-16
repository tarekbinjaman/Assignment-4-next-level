import express from "express";
import { authorizeRoles } from "../../middleware/authorizeRole";
import { Role } from "../../../generated/prisma/enums";
import { authenticateUser } from "../../middleware/authenticate";
import { getStudentDashboard, getTutorDashboard } from "./dashboard.controller";


const router = express.Router();

router.get("/student", authenticateUser, authorizeRoles(Role.STUDENT), getStudentDashboard);
router.get("/tutor", authenticateUser, authorizeRoles(Role.TUTOR), getTutorDashboard);

export default router;