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

const getTutorDashboard = async (userId: string) => {
  const today = new Date();
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

  const nextSession = await prisma.booking.findFirst({
    where: {
      tutorId,
      status: BookingStatus.ACCEPTED,
      date: {
        gte: today,
      },
    }, 
    orderBy: {
      date: "asc"
    },
    include: {
      student: true,
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
      createdAt: "desc"
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
      averageRatingResult: Number(
        averageRatingResult._avg.rating ?? 0
      ).toFixed(1)
    },
    nextSession: nextSession ? {
      id: nextSession.id,
      studentName: nextSession.student.name,
      studentImage: nextSession.student.image,
      date: nextSession.date,
      startTime: nextSession.startTime,
      endTime: nextSession.endTime,
      status: nextSession.status,
    }
    :
    null,

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
  };


};

export const DashboardService = {
  getStudentDashboard,
  getTutorDashboard,
};
