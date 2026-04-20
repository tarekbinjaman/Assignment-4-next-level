import { prisma } from "../../lib/prisma";

export const createBooking = async (userId: string, payload: any) => {
  const date = new Date(payload.date);
  /* after converting date like this i can use it whatever i want
date.getFullYear()   // 2026
date.getMonth()      // 3 (April, because 0-based)
date.getDate()       // 25
date.getHours()      // 10 (depends on timezone)
    
    */

  if (date < new Date()) {
    throw new Error("Cannot book past time");
  }

  return await prisma.booking.create({
    data: {
      studentId: userId,
      tutorId: payload.tutorId as string,
      date,
    },
  });
};

export const getMybookings = async (userId: string) => {
  return await prisma.booking.findMany({
    where: { studentId: userId },
    include: {
      tutor: true,
    },
  });
};
