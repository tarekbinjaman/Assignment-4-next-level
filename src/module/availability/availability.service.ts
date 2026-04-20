import { prisma } from "../../lib/prisma"

export const createAvailability = async (userId: string, payload: any) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {userId},
    }) // finding tutro for createAvailability

    if(!tutor) {
        throw new Error("Tutor not found");
    }

    return await prisma.availability.create({
        data: {
            tutorId: tutor.id,
            day: payload.day,
            startTime: payload.startTime,
            endTime: payload.endTime,
        },
    });
};

export const getMyAvailability = async (userId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {userId},
    }); // finding tutor for getMyAvailability

    return await prisma.availability.findMany({
        where: {tutorId: tutor?.id as string}
    });

};


