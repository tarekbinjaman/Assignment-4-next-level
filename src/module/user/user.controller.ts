import { Request, Response } from "express";
import * as UserService from "./user.service";
import { prisma } from "../../lib/prisma";

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createuser(req.body);
    res.status(201).json({
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

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllusers();
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

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getSingleUser(req.params.id as string);
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.delteUser(req.params.id as string);
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

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    console.log("This is from getme route", userId)
    if(!userId) {
      return res.status(400).json({success: false, message: "User Id not found in token."});
    }

    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        image: true,
      }
    });

    if(!user) {
      return res.status(404).json({success: false, message: "User not found."});
    }

    res.status(200).json({success: true, data: user});

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}