import { prisma } from "../../lib/prisma"

export const createReview = async (userId: string, payload: any) => {
 const { bookingId, rating, comment } = payload;
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      review: true,
    },
  });

    if(!booking) {
        throw new Error("Booking not found and review created failed")
    }

    // stop creating on others booking
    if(booking.studentId !== userId){
        throw new Error("Unauthorized");
    }

    // review when only completed booking
    if(booking.status !== "COMPLETED") {
        throw new Error("You can only review completed bookings")
    }

    return await prisma.review.create({
        data: {
            userId,
            bookingId: payload.bookingId,
            rating: payload.rating,
            comment: payload.comment,
        }, 
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            }
        }
    })
}

export const getReviews = async () => {
  return prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSingleReview = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      booking: true,
    },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  return review;
};


export const updateReview = async (
  id: string,
  userId: string,
  payload: any
) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  if (review.userId !== userId) {
    throw new Error("Unauthorized.");
  }

  if (
    payload.rating &&
    (payload.rating < 1 || payload.rating > 5)
  ) {
    throw new Error("Rating must be between 1 and 5.");
  }

  return prisma.review.update({
    where: { id },
    data: {
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};


export const deleteReview = async (
  id: string,
  userId: string
) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new Error("Review not found.");
  }

  if (review.userId !== userId) {
    throw new Error("Unauthorized.");
  }

  await prisma.review.delete({
    where: { id },
  });
};