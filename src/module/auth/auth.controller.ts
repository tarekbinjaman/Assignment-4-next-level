import { Request, Response } from "express";
import * as AuthService from "./auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.loginUser(email, password);

    res.cookie("accessToken", result.token, {
      httpOnly: true, // httpOnly: true means this token will access only server not browser. cause if i not use httpOnly: true hacker could access my token in browser console like this "document.cookie"
      secure: false, // true in production. Currently (false) means now it will work also in only http. If true then it will work only https
      sameSite: "lax", // using "lax" in cross site means different website it will allow to get method but not post/put/delete. so in main website nothing will change.
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
