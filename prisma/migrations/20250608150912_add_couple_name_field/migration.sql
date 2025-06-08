/*
  Warnings:

  - The primary key for the `Capsule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DiaryEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `DiaryEntry` table. All the data in the column will be lost.
  - You are about to drop the column `momentAt` on the `DiaryEntry` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `DiaryEntry` table. All the data in the column will be lost.
  - The primary key for the `Dream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GalleryEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `momentAt` on the `GalleryEntry` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `GalleryEntry` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `GalleryEntry` table. All the data in the column will be lost.
  - The primary key for the `Memory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `Memory` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Memory` table. All the data in the column will be lost.
  - The primary key for the `Milestone` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `Milestone` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `date` to the `DiaryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DiaryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `DiaryEntry` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `DiaryEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `DiaryEntry` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `imageUrl` to the `GalleryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `GalleryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GalleryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `GalleryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Milestone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Milestone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Capsule" DROP CONSTRAINT "Capsule_userId_fkey";

-- DropForeignKey
ALTER TABLE "DiaryEntry" DROP CONSTRAINT "DiaryEntry_coupleId_fkey";

-- DropForeignKey
ALTER TABLE "Dream" DROP CONSTRAINT "Dream_userId_fkey";

-- DropForeignKey
ALTER TABLE "GalleryEntry" DROP CONSTRAINT "GalleryEntry_coupleId_fkey";

-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_coupleId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_coupleId_fkey";

-- AlterTable
ALTER TABLE "Capsule" DROP CONSTRAINT "Capsule_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Capsule_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Capsule_id_seq";

-- AlterTable
ALTER TABLE "DiaryEntry" DROP CONSTRAINT "DiaryEntry_pkey",
DROP COLUMN "imageUrl",
DROP COLUMN "momentAt",
DROP COLUMN "videoUrl",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "coupleId" DROP NOT NULL,
ADD CONSTRAINT "DiaryEntry_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DiaryEntry_id_seq";

-- AlterTable
ALTER TABLE "Dream" DROP CONSTRAINT "Dream_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Dream_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Dream_id_seq";

-- AlterTable
ALTER TABLE "GalleryEntry" DROP CONSTRAINT "GalleryEntry_pkey",
DROP COLUMN "momentAt",
DROP COLUMN "type",
DROP COLUMN "url",
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "coupleId" DROP NOT NULL,
ADD CONSTRAINT "GalleryEntry_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GalleryEntry_id_seq";

-- AlterTable
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_pkey",
DROP COLUMN "imageUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "coupleId" DROP NOT NULL,
ADD CONSTRAINT "Memory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Memory_id_seq";

-- AlterTable
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_pkey",
DROP COLUMN "imageUrl",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "coupleId" DROP NOT NULL,
ADD CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Milestone_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "anniversary" TIMESTAMP(3),
ADD COLUMN     "coupleName" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "inviteTokenExpires" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Capsule" ADD CONSTRAINT "Capsule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dream" ADD CONSTRAINT "Dream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryEntry" ADD CONSTRAINT "GalleryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryEntry" ADD CONSTRAINT "GalleryEntry_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEntry" ADD CONSTRAINT "DiaryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEntry" ADD CONSTRAINT "DiaryEntry_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
