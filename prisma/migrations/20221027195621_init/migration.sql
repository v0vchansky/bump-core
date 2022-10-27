-- CreateTable
CREATE TABLE "Users" (
    "uuid" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Verifications" (
    "uuid" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Verifications_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_uuid_key" ON "Users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Verifications_uuid_key" ON "Verifications"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Verifications_phone_key" ON "Verifications"("phone");
