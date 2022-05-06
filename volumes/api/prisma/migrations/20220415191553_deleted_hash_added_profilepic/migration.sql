/*
  Warnings:

  - You are about to drop the column `hash` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[defaultPic]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `defaultPic` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hash",
ADD COLUMN     "defaultPic" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_defaultPic_key" ON "users"("defaultPic");
