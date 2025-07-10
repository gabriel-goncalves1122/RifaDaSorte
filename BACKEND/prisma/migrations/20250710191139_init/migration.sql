-- DropForeignKey
ALTER TABLE "Bilhete" DROP CONSTRAINT "Bilhete_rifaId_fkey";

-- DropForeignKey
ALTER TABLE "Premio" DROP CONSTRAINT "Premio_rifaId_fkey";

-- AddForeignKey
ALTER TABLE "Premio" ADD CONSTRAINT "Premio_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bilhete" ADD CONSTRAINT "Bilhete_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
