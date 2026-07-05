import { Request, Response } from "express";
import * as BookingService from "./booking.service";
import { prisma } from "../../lib/prisma";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const booking = await BookingService.createBooking(userId, req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBooking = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await BookingService.getMybookings(userId);

  res.json({
    success: true,
    data: result,
  });
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const {tutorId, date} = req.query;
    if(!tutorId || !date) {
      throw new Error("Tutor ID and date are required.");
    }

    const slots = await BookingService.getAvailableSlots(
      tutorId as string,
      date as string
    );

    res.status(200).json({
      success: true,
      message: "Available slots retrieved successfully.",
      data: slots,
    });

  } catch(error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};