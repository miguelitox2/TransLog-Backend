-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cte" (
    "id" TEXT NOT NULL,
    "numberCte" TEXT NOT NULL,
    "openingData" TIMESTAMP(3) NOT NULL,
    "shipperName" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "priority" TEXT,
    "status" TEXT,
    "ro" INTEGER,
    "value" DOUBLE PRECISION,
    "accountable" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "cte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cte_id_key" ON "cte"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cte_numberCte_key" ON "cte"("numberCte");

-- CreateIndex
CREATE UNIQUE INDEX "cte_ro_key" ON "cte"("ro");

-- CreateIndex
CREATE UNIQUE INDEX "client_id_key" ON "client"("id");
