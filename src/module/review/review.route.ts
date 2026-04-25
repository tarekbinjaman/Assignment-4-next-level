import express from 'express';
import * as ReviewController from './review.controller';
import { authenticateUser } from '../../middleware/authenticate';


const router = express.Router();

router.post("/", authenticateUser, ReviewController.createReview);


export default router;