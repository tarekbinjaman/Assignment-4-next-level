import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

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

export const DashboardService = {
  getStudentDashboard,
};
