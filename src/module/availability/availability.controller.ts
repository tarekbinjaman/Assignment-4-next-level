import { Request, Response } from "express";
import * as AvailabilityService from "./availability.service";

export const createAvailAbility = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await AvailabilityService.createAvailability(
      userId,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyAvailability = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await AvailabilityService.getMyAvailability(userId);

  res.json({
    success: true,
    data: result,
  });
};
