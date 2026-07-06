/*
  Warnings:

  - Added the required column `duration` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL;
