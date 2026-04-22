import { prisma } from "../../lib/prisma"

export const createReview = async (userId: string, payload: any) => {

    const booking = await prisma.booking.findUnique({
        where: {id: payload.bookingId},
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
        }
    })
}