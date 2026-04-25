import { Request, Response } from "express";
import * as ReviewService from "./review.service";

export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await ReviewService.createReview(userId, req.body);

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
