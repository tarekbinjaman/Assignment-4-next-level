import { error } from "node:console";
import { prisma } from "../../lib/prisma";

export const createTutorProfile = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // check if this user has already tutor account
  const existing = await prisma.tutorProfile.findUnique({
    where: { id: userId },
  });

  if (existing) {
    throw new Error("Tutor profile is already exist");
  }

  const result = await prisma.tutorProfile.create({
    data: {
      userId,
      bio: payload.bio,
      hourlyRate: payload.hourlyRate,
      categories: {
        connect: payload.categoryIds?.map((id: string) => ({ id })),
      },
    },
    include: {
      user: true,
      categories: true,
    },
  });
  return result;
};

export const getAllTutors = async () => {
  return await prisma.tutorProfile.findMany({
    include: {
      user: true,
      categories: true,
      availability: true,
    },
  });
};

export const getSingleTutor = async (id: string) => {
  return await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      categories: true,
      availability: true,
    },
  });
};

export const updateTutorProfile = async (id: string, payload: any) => {
  return await prisma.tutorProfile.update({
    where: { id },
    data: {
      bio: payload.bio,
      hourlyRate: payload.hourlyRate,
    },
  });
};
