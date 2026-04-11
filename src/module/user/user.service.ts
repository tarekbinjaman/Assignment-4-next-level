import { prisma } from "../../lib/prisma";

export const createuser = async (payload: any) => {
  const result = await prisma.user.create({
    data: payload,
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
