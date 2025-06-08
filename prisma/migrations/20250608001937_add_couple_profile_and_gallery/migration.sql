-- AlterTable
ALTER TABLE "Couple" ADD COLUMN     "anniversary" TIMESTAMP(3),
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "GalleryEntry" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coupleId" TEXT NOT NULL,
    "description" TEXT,
    "momentAt" TIMESTAMP(3),

    CONSTRAINT "GalleryEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GalleryEntry" ADD CONSTRAINT "GalleryEntry_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
