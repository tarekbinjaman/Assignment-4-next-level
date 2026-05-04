import express from "express";
import * as UserController from "./user.controller";
import { authenticateUser } from "../../middleware/authenticate";

const router = express.Router();

router.post("/register", UserController.createUser);
router.get("/", UserController.getAllUser);
router.get("/me", authenticateUser, UserController.getMe);
router.get("/:id", UserController.getSingleUser);
router.delete("/:id", UserController.deleteUser);

export default router;