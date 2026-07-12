import { Request, Response } from "express";
import { DashboardService } from "./dashboard.sevice";

export const getStudentDashboard = async (req: Request, res:Response) => {
    try {
        const studenId = (req as any).user.id;
        const result = await DashboardService.getStudentDashboard(studenId);

        res.status(200).json({
            success: true,
            data: result,
        })
    } catch(error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};