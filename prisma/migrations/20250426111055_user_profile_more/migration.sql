-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "birth_place" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "q1" TEXT,
ADD COLUMN     "q2" TEXT,
ADD COLUMN     "reset_token_expiry" TIMESTAMP(3),
ALTER COLUMN "password" DROP NOT NULL;
