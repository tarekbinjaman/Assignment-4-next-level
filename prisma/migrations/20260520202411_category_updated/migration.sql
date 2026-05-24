/*
  Warnings:

  - You are about to drop the `_CategoryToTutorProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToTutorProfile" DROP CONSTRAINT "_CategoryToTutorProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToTutorProfile" DROP CONSTRAINT "_CategoryToTutorProfile_B_fkey";

-- DropTable
DROP TABLE "_CategoryToTutorProfile";

-- CreateTable
CREATE TABLE "_TutorCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TutorCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TutorCategories_B_index" ON "_TutorCategories"("B");

-- AddForeignKey
ALTER TABLE "_TutorCategories" ADD CONSTRAINT "_TutorCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TutorCategories" ADD CONSTRAINT "_TutorCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "TutorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
