-- CreateTable
CREATE TABLE "PullData" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pullsToday" INTEGER NOT NULL,
    "pullsTotal" INTEGER NOT NULL,

    CONSTRAINT "PullData_pkey" PRIMARY KEY ("id")
);
