import { prisma } from "../../lib/prisma";

export const createBooking = async (userId: string, payload: {tutorId: string; date: string;}) => {
  const bookingDate = new Date(payload.date);
  /* after converting date like this i can use it whatever i want
bookingDate.getFullYear()   // 2026
bookingDate.getMonth()      // 3 (April, because 0-based)
bookingDate.getDate()       // 25
bookingDate.getHours()      // 10 (depends on timezone)
    
    */



// check date
  if (bookingDate < new Date()) {
    throw new Error("Cannot book past time");
  }

  // check student exists
  const student = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if(!student) {
    throw new Error("Student not found");
  }

  // check tutor exists
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: payload.tutorId,
    },
  });

  if(!tutor) {
    throw new Error("Tutor not found");
  }

  // prevent booking yourself
  if(tutor.userId === userId) {
    throw new Error("You cannot book yourself.");
  }


  // check if slot already booked
  const existingBooking = await prisma.booking.findUnique({
    where: {
      tutorId_date: {
        tutorId: payload.tutorId,
        date: bookingDate
      }
    }
  })

  if(existingBooking) {
    throw new Error("This slot has already been booked")
  }

  // 
  return await prisma.booking.create({
    data: {
      studentId: userId,
      tutorId: payload.tutorId as string,
      date: bookingDate,
    },
    include: {
      tutor: {
        include: {
          user: true,
        }
      }
    }
  });
};

export const getMybookings = async (userId: string) => {
  return await prisma.booking.findMany({
    where: { studentId: userId },
    include: {
      tutor: {
        include: {
          user: true,
          categories: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
};
