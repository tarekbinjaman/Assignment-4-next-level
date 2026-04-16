import { Request, Response } from "express";
import * as TutorService from "./tutor.service";

export const createTutor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // from middleware

    const result = await TutorService.createTutorProfile(userId, req.body);

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

export const getTutors = async (req: Request, res: Response) => {
  const result = await TutorService.getAllTutors();
  res.json({
    success: true,
    data: result,
  });
};

export const getTutor = async (req: Request, res: Response) => {
  const result = await TutorService.getSingleTutor(req.params.id as string);

  res.json({
    success: true,
    data: result,
  });
};

export const updateTutor = async (req: Request, res: Response) => {
  const result = await TutorService.updateTutorProfile(
    req.params.id as string,
    req.body,
  );

  res.json({
    success: true,
    data: result,
  });
};
