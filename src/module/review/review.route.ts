import express from 'express';
import * as ReviewController from './review.controller';
import { authenticateUser } from '../../middleware/authenticate';


const router = express.Router();

router.post("/", authenticateUser, ReviewController.createReview);
router.get("/", ReviewController.getReviews);
router.get("/:id", ReviewController.getSingleReview);
router.patch("/:id", authenticateUser, ReviewController.updateReview);
router.delete("/:id", authenticateUser, ReviewController.deleteReview);
router.get("/tutor/:tutorId", ReviewController.getTutorReviews);

export default router;