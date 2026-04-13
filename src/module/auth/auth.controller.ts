import { Request, Response } from "express";
import * as AuthService from './auth.service';

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const result = await AuthService.loginUser(email, password);

        res.status(200).json({
            success: true,
            data: result
        })
        
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}