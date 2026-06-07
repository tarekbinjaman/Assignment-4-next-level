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

    if(!tutor) {
        throw new Error("Tutor not found in getMyavailability")
    }

    return await prisma.availability.findMany({
        where: {tutorId: tutor?.id as string}
    });

};


export const updateAvailability = async (userId: string, availabilityId: string, payload: any) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {userId},
    });

    if(!tutor) {
        throw new Error("Tutor not found");
    }

    const availability = await prisma.availability.findUnique({
        where: {id: availabilityId}
    })

    if(!availability) {
        throw new Error("Availability not found");
    }
    if(availability?.tutorId !== tutor?.id) {
        throw new Error("Unauthorized");
    }
    return await prisma.availability.update({
        where: {
            id: availabilityId,
        },
        data: {
            day: payload.day,
            startTime: payload.startTime,
            endTime: payload.endTime,
        },
    });
};

export const deleteAvailability = async (userId: string, availabilityId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: {userId},
    });

    if(!tutor) {
        throw new Error("Tutor not found in delteAvailability service");
    }

    const availability = await prisma.availability.findUnique({
        where: {id: availabilityId},
    })

    if(!availability) {
        throw new Error("Availability not found in deleteAvailability service");
    }

    if(availability.tutorId !== tutor.id) {
        throw new Error ("Unauthorized access from delteAvailability service");
    }

    return await prisma.availability.delete({
        where: {
            id: availabilityId,
        },
    });
};

