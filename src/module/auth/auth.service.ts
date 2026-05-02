import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

dotenv.config();

const jwt_secret = process.env.JWT_SECRET as string;

export const loginUser = async (email: string, passwrod: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(passwrod, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }
  
  const token = jwt.sign(
    { userId: user?.id, role: user.role }, // data to set in token
    jwt_secret, // secret that will help to verify
    { expiresIn: "7d" }, // time when will expired the token and need to login again
  );

  return {
    token,
  };
};

