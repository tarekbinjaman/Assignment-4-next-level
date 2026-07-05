/*
  Warnings:

  - A unique constraint covering the columns `[tutorId,date,startTime]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_tutorId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tutorId_date_startTime_key" ON "Booking"("tutorId", "date", "startTime");
