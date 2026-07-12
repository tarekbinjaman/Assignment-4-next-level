import express from "express";
import { authorizeRoles } from "../../middleware/authorizeRole";
import { Role } from "../../../generated/prisma/enums";
import { authenticateUser } from "../../middleware/authenticate";
import { getStudentDashboard } from "./dashboard.controller";


const router = express.Router();

router.get("/student", authenticateUser, authorizeRoles(Role.STUDENT), getStudentDashboard);

export default router;