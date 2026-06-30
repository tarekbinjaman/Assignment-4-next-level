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

export const getReviews = async (_req: Request, res: Response) => {
  try {
    const result = await ReviewService.getReviews();

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleReview = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getSingleReview(req.params.id as string);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await ReviewService.updateReview(
      req.params.id as string,
      userId,
      req.body
    );

    res.json({
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

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    await ReviewService.deleteReview(req.params.id as string, userId);

    res.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};