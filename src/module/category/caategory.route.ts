import express from 'express';
import * as CategoryController from "./category.controller"

const router = express.Router();

router.post("/", CategoryController.createCategory);
router.post("/", CategoryController.getAllCategory);
router.post("/:id", CategoryController.getSingleCategory);

export default router;