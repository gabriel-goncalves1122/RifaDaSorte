-- DropForeignKey
ALTER TABLE "LogAuditoria" DROP CONSTRAINT "LogAuditoria_rifaId_fkey";

-- AddForeignKey
ALTER TABLE "LogAuditoria" ADD CONSTRAINT "LogAuditoria_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
