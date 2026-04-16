import { Request, Response } from "express";
import * as CategoryService from "./category.service";

export const createCategory = async (req: Request, res: Response) => {
  try {
    
    const result = await CategoryService.createCategory(req.body);
    
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



export const getAllCategory = async (req: Request, res: Response) => {
    try {

        const result = await CategoryService.getAllCategory();
        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const getSingleCategory = async (req: Request, res: Response) => {
    try {
        const result = CategoryService.getSingleCategory(req.params.id as string);
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