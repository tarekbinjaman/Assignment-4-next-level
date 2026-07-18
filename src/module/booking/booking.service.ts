import { Day } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const createBooking = async (
  userId: string,
  payload: {
    tutorId: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    notes?: string;
  },
) => {
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

  if (!student) {
    throw new Error("Student not found");
  }

  // check tutor exists
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: payload.tutorId,
    },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  const totalPrice = ((Number(tutor.hourlyRate) / 60) * payload.duration).toFixed(2);

  // prevent booking yourself
  if (tutor.userId === userId) {
    throw new Error("You cannot book yourself.");
  }

  // checking date
  if (bookingDate < new Date()) {
  throw new Error("Cannot book past time");
}

  // check if slot already booked
  const existingBooking = await prisma.booking.findUnique({
    where: {
      tutorId_date_startTime: {
        tutorId: payload.tutorId,
        date: bookingDate,
        startTime: payload.startTime,
      },
    },
  });

  if (existingBooking) {
    throw new Error("This slot has already been booked");
  }

  //
  return await prisma.booking.create({
    data: {
      studentId: userId,
      tutorId: payload.tutorId as string,
      startTime: payload.startTime,
      endTime: payload.endTime,
      date: bookingDate,
      totalPrice,
      duration: payload.duration,
      notes: payload.notes ?? null,
    },
    include: {
      tutor: {
        include: {
          user: true,
        },
      },
    },
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

export const getAvailableSlots = async (tutorId: string, date: string) => {
  const bookingDate = new Date(date);
  if (isNaN(bookingDate.getTime())) {
    throw new Error("Invalid booking date");
  }

  // convert selected date to Day enum
  const weekDay = bookingDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase() as Day;

    // console.log("week day from slots service", weekDay)

  // find tutor
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  // get tutor availability for the selected day
  const availability = await prisma.availability.findMany({
    where: {
      tutorId,
      day: weekDay,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // console.log("availability from slot service", availability)
  // console.log("tutor id and date from slot service", tutorId, date)

  if (availability.length === 0) {
    return [];
  }

  // get already booked time slots
  const bookedSlots = await prisma.booking.findMany({
    where: {
      tutorId,
      date: bookingDate,
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  // Remove booked slots
  const availableSlots = availability.filter((slot) => {
    return !bookedSlots.some(
      (booking) =>
        booking.startTime === slot.startTime &&
        booking.endTime === slot.endTime,
    );
  });



  return availableSlots;
};
