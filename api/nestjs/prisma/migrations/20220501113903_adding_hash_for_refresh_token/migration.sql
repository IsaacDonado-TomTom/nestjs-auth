-- DropIndex
DROP INDEX "users_nickname_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshTokenHash" TEXT;
