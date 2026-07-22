import { Request, Response } from "express";
import { DashboardService } from "./dashboard.sevice";
import { BookingStatus } from "../../../generated/prisma/enums";

export const getStudentDashboard = async (req: Request, res: Response) => {
  try {
    const studenId = (req as any).user.id;
    const result = await DashboardService.getStudentDashboard(studenId);

    res.status(200).json({
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

export const getTutorDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { search, status, sort } = req.query;
      //   const statuses = status
      // ? (status as string).split(",") as BookingStatus[]
      // : undefined;
    const result = await DashboardService.getTutorDashboard(userId, search as string, status as string, sort as "asc" | "desc" | undefined);
    res.status(200).json({
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

export const updateTutorSessionStatus = async (req: Request, res: Response) => {
  console.log(
    "updateTutorSessionStatus called with params:",
    req.params,
    "and body:",
    req.body,
  );
  try {
    const userId = (req as any).user.id;
    const result = await DashboardService.updateTutorSessionStatus(
      userId,
      req.params.id as string,
      req.body.status,
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.log("Error updating tutor session status:", error);
  }
};

export const getTutorSessionDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const result = await DashboardService.getTutorSessionDetails(
      userId,
      id as string
    );

    res.status(200).json({
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