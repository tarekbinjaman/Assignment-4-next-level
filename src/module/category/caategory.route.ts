import express from 'express';
import * as CategoryController from "./category.controller"

const router = express.Router();

router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getAllCategory);
router.get("/:id", CategoryController.getSingleCategory);

export default router;