-- CreateTable
CREATE TABLE "Geolocations" (
    "uuid" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "localTime" TIMESTAMP(3) NOT NULL,
    "batteryLevel" DOUBLE PRECISION NOT NULL,
    "batteryIsCharging" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userUuid" TEXT NOT NULL,

    CONSTRAINT "Geolocations_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Geolocations_uuid_key" ON "Geolocations"("uuid");

-- AddForeignKey
ALTER TABLE "Geolocations" ADD CONSTRAINT "Geolocations_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "Users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
