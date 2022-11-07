-- CreateTable
CREATE TABLE "UsersRelations" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "targetUserUuid" TEXT NOT NULL,

    CONSTRAINT "UsersRelations_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsersRelations_uuid_key" ON "UsersRelations"("uuid");

-- AddForeignKey
ALTER TABLE "UsersRelations" ADD CONSTRAINT "UsersRelations_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "Users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
