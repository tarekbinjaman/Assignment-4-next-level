import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const calculateDuration = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const totalMinutes =
    endHour * 60 + endMinute - (startHour * 60 + startMinute);

  return `${totalMinutes} mins`;
};

const getStudentDashboard = async (studentId: string) => {
  const today = new Date();
  // =========================
  // Dashboard Stats
  // =========================

  const upcomingSessions = await prisma.booking.count({
    where: {
      studentId,
      status: BookingStatus.ACCEPTED,
      date: {
        gte: today,
      },
    },
  });

  const completedSessions = await prisma.booking.count({
    where: {
      studentId,
      status: BookingStatus.COMPLETED,
    },
  });

  const totalSpentResult = await prisma.booking.aggregate({
    where: {
      studentId,
      status: {
        in: [BookingStatus.ACCEPTED, BookingStatus.COMPLETED],
      },
    },
    _sum: {
      totalPrice: true,
    },
  });

  const reviewsGiven = await prisma.review.count({
    where: {
      userId: studentId,
    },
  });

  // =========================
  // Next Session
  // =========================

  const nextSession = await prisma.booking.findFirst({
    where: {
      studentId,
      status: BookingStatus.ACCEPTED,
      date: {
        gte: today,
      },
    },
    orderBy: {
      date: "asc",
    },
    include: {
      tutor: {
        include: {
          user: true,
          categories: true,
        },
      },
    },
  });

  // =========================
  // Recent Bookings
  // =========================

  const recentBookings = await prisma.booking.findMany({
    where: {
      studentId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      tutor: {
        include: {
          user: true,
          categories: true,
        },
      },
    },
  });

  // =========================
  // Total sessions including (pending, accepted, completed)
  // =========================

  const totalSessions = await prisma.booking.count({
    where: {
      studentId,
      status: {
        in: [
          BookingStatus.PENDING,
          BookingStatus.ACCEPTED,
          BookingStatus.COMPLETED,
        ],
      },
    },
  });

  return {
    stats: {
      upcomingSessions,
      completedSessions,
      totalSpent: Number(totalSpentResult._sum.totalPrice ?? 0),
      reviewsGiven,
    },
    nextSession: nextSession
      ? {
          id: nextSession.id,
          tutorName: nextSession.tutor.user.name,
          tutorImage: nextSession.tutor.user.image,
          category:
            nextSession.tutor.categories.length > 0
              ? nextSession.tutor.categories[0]?.name
              : "General",
          date: nextSession.date,
          startTime: nextSession.startTime,
          endTime: nextSession.endTime,
          status: nextSession.status,
        }
      : null,

    recentBookings: recentBookings.map((booking) => ({
      id: booking.id,
      tutorName: booking.tutor.user.name,
      tutorImage: booking.tutor.user.image,
      category:
        booking.tutor.categories.length > 0
          ? booking.tutor.categories[0]?.name
          : "General",
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
    })),
    totalSessions,
  };
};

const getTutorDashboard = async (
  userId: string,
  search?: string,
  status?: string,
  sort: "asc" | "desc" = "desc",
) => {
  const today = new Date("2026-07-23");
  // =========================
  // Get Tutor Profile
  // =========================
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!tutor) {
    throw new Error("Tutor profile not found");
  }

  const tutorId = tutor?.id;

  // =========================
  // Sessions
  // =========================

  const statusFilter = status
    ? (status.split(",") as BookingStatus[])
    : [];

  const sessions = await prisma.booking.findMany({
    where: {
      tutorId,
      ...(status && {
        status: {
          in: statusFilter,
        },
      }),
      ...(search && {
        student: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      }),
    },
    orderBy: {
      date: sort,
    },
    include: {
      student: true,
      tutor: {
        include: {
          categories: true,
        },
      },
    },
  });

  // =========================
  // Dashboard Stats
  // =========================

  const upcomingSessions = await prisma.booking.count({
    where: {
      tutorId,
      status: BookingStatus.ACCEPTED,
      date: {
        gte: today,
      },
    },
  });

  const completedSession = await prisma.booking.count({
    where: {
      tutorId,
      status: BookingStatus.COMPLETED,
    },
  });

  const students = await prisma.booking.findMany({
    where: {
      tutorId,
      status: BookingStatus.COMPLETED,
    },
    distinct: ["studentId"],
    select: {
      studentId: true,
    },
  });

  const totalStudent = students.length;

  // Average Rating
  const averageRatingResult = await prisma.review.aggregate({
    where: {
      booking: {
        tutorId,
      },
    },
    _avg: {
      rating: true,
    },
  });

  // =========================
  // Next Session
  // =========================

  const nextSession = await prisma.booking.findMany({
    where: {
      tutorId,
      status: BookingStatus.ACCEPTED,
      date: {
        gte: today,
      },
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        startTime: "asc",
      },
    ],
    include: {
      student: true,
      tutor: {
        include: {
          categories: true,
        },
      },
    },
  });

  // =========================
  // Recent Sessions
  // =========================

  const recentSessions = await prisma.booking.findMany({
    where: {
      tutorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      student: true,
      tutor: {
        include: {
          categories: true,
        },
      },
    },
  });

  // =========================
  // Recent Reviews
  // =========================

  const recentReviews = await prisma.review.findMany({
    where: {
      booking: {
        tutorId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      user: true,
      booking: {
        include: {
          tutor: {
            include: {
              categories: true,
            },
          },
        },
      },
    },
  });

  return {
    stats: {
      upcomingSessions,
      completedSession,
      totalStudent,
      averageRatingResult: Number(averageRatingResult._avg.rating ?? 0).toFixed(
        1,
      ),
    },
    nextSession: nextSession.map((session) => ({
      id: session.id,
      studentName: session.student.name,
      studentImage: session.student.image,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      category: session.tutor?.categories?.[0]?.name ?? "General",
      duration: calculateDuration(session.startTime, session.endTime),
      status: session.status,
    })),

    recentReviews: recentReviews.map((review) => ({
      id: review.id,
      studentName: review.user.name,
      studentImage: review.user.image,
      rating: review.rating,
      comment: review.comment,
      category:
        review.booking.tutor.categories.length > 0
          ? review.booking.tutor.categories[0]?.name
          : "General",
      createdAt: review.createdAt,
    })),

    recentSessions: recentSessions.map((session) => ({
      id: session.id,
      studentName: session.student.name,
      studentImage: session.student.image,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
      category:
        session.tutor.categories.length > 0
          ? session.tutor.categories[0]?.name
          : "General",
    })),

    allSessions: sessions.map((session) => ({
      id: session.id,
      studentName: session.student.name,
      studentImage: session.student.image,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
      category:
        session.tutor.categories.length > 0
          ? session.tutor.categories[0]?.name
          : "General",
    })),
  };
};

const updateTutorSessionStatus = async (
  userId: string,
  bookingId: string,
  status: BookingStatus,
) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!tutor) {
    throw new Error("Tutor profile not found");
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      tutorId: tutor?.id,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const updateBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
  });
  return updateBooking;
};

const getTutorSessionDetails = async (userId: string, bookingId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!tutor) {
    throw new Error("Tutor profile not found");
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      tutorId: tutor.id,
    },
    include: {
      student: true,
      tutor: {
        include: {
          user: true,
          categories: true,
        },
      },
      review: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return {
    id: booking.id,

    student: {
      id: booking.student.id,
      name: booking.student.name,
      image: booking.student.image,
      email: booking.student.email,
    },

    session: {
      category:
        booking.tutor.categories.length > 0
          ? booking.tutor.categories[0].name
          : "General",

      date: booking.date,

      startTime: booking.startTime,

      endTime: booking.endTime,

      duration: calculateDuration(booking.startTime, booking.endTime),

      status: booking.status,
    },

    booking: {
      totalPrice: Number(booking.totalPrice),

      notes: booking.notes,

      createdAt: booking.createdAt,
    },

    review: booking.review
      ? {
          rating: booking.review.rating,
          comment: booking.review.comment,
        }
      : null,
  };
};

export const DashboardService = {
  getStudentDashboard,
  getTutorDashboard,
  updateTutorSessionStatus,
  getTutorSessionDetails,
};
