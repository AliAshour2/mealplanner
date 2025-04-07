-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "allergies" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "calorie_target" INTEGER NOT NULL DEFAULT 2200,
ADD COLUMN     "completed_meals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dietary_preferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "saved_recipes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streak_days" INTEGER NOT NULL DEFAULT 0;
