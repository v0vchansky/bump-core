-- CreateTable
CREATE TABLE "ShadowActions" (
    "uuid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetUserUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShadowActions_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShadowActions_uuid_key" ON "ShadowActions"("uuid");

-- AddForeignKey
ALTER TABLE "ShadowActions" ADD CONSTRAINT "ShadowActions_targetUserUuid_fkey" FOREIGN KEY ("targetUserUuid") REFERENCES "Users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
