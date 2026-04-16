import { prisma } from "../../lib/prisma";

type category = {
  name: string;
};

export const createCategory = async (payload: category) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

export const getAllCategory = async () => {
  return await prisma.category.findMany();
};

export const getSingleCategory = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};
