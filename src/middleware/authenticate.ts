import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

dotenv.config(); // for access .env
const jwt_secret = process.env.JWT_SECRET as string;

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
   
    const token = req.cookies.accessToken

    console.log("TOken hasbeen come from front end", token)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, jwt_secret) as any;

    console.log("Decoded user data from token ", decoded.userId)
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    console.log("authenticate user data", user)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    (req as any).user = user;

    console.log("user from req.user", req)

    next();


  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
