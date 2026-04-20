import express from 'express';
import * as BookingController from './booking.controller';
import { authenticateUser } from '../../middleware/authenticate';


const router = express.Router();

router.post("/", authenticateUser, BookingController.createBooking);
router.post("/", authenticateUser, BookingController.getMyBooking);


export default router;