/*
  Warnings:

  - You are about to drop the `LogAuditoria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LogAuditoria" DROP CONSTRAINT "LogAuditoria_rifaId_fkey";

-- DropTable
DROP TABLE "LogAuditoria";
