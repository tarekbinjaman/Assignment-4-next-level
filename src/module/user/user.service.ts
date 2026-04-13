import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

export const createuser = async (payload: any) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const result = await prisma.user.create({
    data: { ...payload, password: hashPassword },
  });
  return result;
};

export const getAllusers = async () => {
  return await prisma.user.findMany();
};

export const getSingleUser = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const delteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};
