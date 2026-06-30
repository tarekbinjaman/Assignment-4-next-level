import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import { Day } from "../../../generated/prisma/enums";

export const createTutorProfile = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // check if this user has already tutor account
  const existing = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("Tutor profile is already exist");
  }

  const result = await prisma.tutorProfile.create({
    data: {
      userId,
      bio: payload.bio,
      experience: payload.experience,
      hourlyRate: payload.hourlyRate,
      categories: {
        connect: payload.categoryIds?.map((id: string) => ({ id })),
      },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      categories: true,
    },
  });
  return result;
};

export const getAllTutors = async ({
  category,
  sort,
  search,
  availableDays
}: {
  category?: string;
  sort?: string;
  search?: string;
  availableDays?: Day[];
}) => {
  return await prisma.tutorProfile.findMany({
    where: {
      ...(search && {
        user: {
          name: {
            contains: search,
            mode: "insensitive"
          }
        }
      }),
      ...(availableDays?.length && {
        availability: {
          some: {
            day: {
              in: availableDays,
            }
          }
        }
      }),
      ...(category && {
        categories: {
          some: {
            name: category,
          },
        },
      }),
    },

    ...(sort === "price_asc" && {
      orderBy: {
        hourlyRate: "asc",
      },
    }),

    ...(sort === "price_desc" && {
      orderBy: {
        hourlyRate: "desc"
      }
    }),

    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      categories: true,
      availability: true,
    },
  });
};

export const getSingleTutor = async (id: string) => {
  return await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      categories: true,
      availability: true,
    },
  });
};

export const updateTutorProfile = async (id: string, payload: any) => {
  // check tutor exists
  const existing = await prisma.tutorProfile.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Tutor profile not found");
  }

  return await prisma.tutorProfile.update({
    where: { id },
    data: {
      bio: payload.bio,
      experience: payload.experience,
      hourlyRate: payload.hourlyRate,

      categories: {
        // remove previous categories
        set: [],

        // add new categories
        connect: payload.categoryIds?.map((id: string) => ({
          id,
        })),
      },
    },
    include: {
      categories: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
};

export const deleteTutorProfile = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
  });

  if (!tutor) {
    throw new Error("Tutor profile not found");
  }

  return await prisma.tutorProfile.delete({
    where: { id },
  });
};
