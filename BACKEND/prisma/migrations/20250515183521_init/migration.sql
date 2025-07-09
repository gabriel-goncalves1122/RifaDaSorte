-- CreateEnum
CREATE TYPE "StatusRifa" AS ENUM ('Ativa', 'Finalizada', 'Cancelada');

-- CreateEnum
CREATE TYPE "StatusBil" AS ENUM ('Disponivel', 'Vendido', 'Premiado');

-- CreateEnum
CREATE TYPE "StatusPag" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO');

-- CreateEnum
CREATE TYPE "MetodoPag" AS ENUM ('PIX', 'CARTAO', 'BOLETO');

-- CreateTable
CREATE TABLE "LogAuditoria" (
    "id" SERIAL NOT NULL,
    "acao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detalhes" TEXT,
    "rifaId" INTEGER NOT NULL,

    CONSTRAINT "LogAuditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Premio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT,
    "rifaId" INTEGER,

    CONSTRAINT "Premio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rifa" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "precoBilhete" DOUBLE PRECISION NOT NULL,
    "quantidadeBilhetes" INTEGER NOT NULL,
    "dataSorteio" TIMESTAMP(3),
    "status" "StatusRifa" NOT NULL DEFAULT 'Ativa',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizadorId" INTEGER NOT NULL,

    CONSTRAINT "Rifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organizador" (
    "id" SERIAL NOT NULL,
    "cnpj" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Organizador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bilhete" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "status" "StatusBil" NOT NULL DEFAULT 'Disponivel',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rifaId" INTEGER NOT NULL,
    "participanteId" INTEGER,

    CONSTRAINT "Bilhete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sorteio" (
    "id" SERIAL NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rifaId" INTEGER NOT NULL,
    "vencedorId" INTEGER,

    CONSTRAINT "Sorteio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "dataEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "destinatarioId" INTEGER NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" "StatusPag" NOT NULL DEFAULT 'PENDENTE',
    "metodo" "MetodoPag" NOT NULL,
    "dataProcessamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bilheteId" INTEGER NOT NULL,
    "participanteId" INTEGER NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremioParticipante" (
    "premioId" INTEGER NOT NULL,
    "participanteId" INTEGER NOT NULL,
    "dataPremiacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PremioParticipante_pkey" PRIMARY KEY ("premioId","participanteId")
);

-- CreateTable
CREATE TABLE "SorteioBilhete" (
    "sorteioId" INTEGER NOT NULL,
    "bilheteId" INTEGER NOT NULL,
    "dataInclusao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SorteioBilhete_pkey" PRIMARY KEY ("sorteioId","bilheteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogAuditoria_rifaId_key" ON "LogAuditoria"("rifaId");

-- CreateIndex
CREATE UNIQUE INDEX "Premio_rifaId_key" ON "Premio"("rifaId");

-- CreateIndex
CREATE UNIQUE INDEX "Organizador_cnpj_key" ON "Organizador"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Organizador_userId_key" ON "Organizador"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Participante_userId_key" ON "Participante"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_bilheteId_key" ON "Pagamento"("bilheteId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- AddForeignKey
ALTER TABLE "LogAuditoria" ADD CONSTRAINT "LogAuditoria_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Premio" ADD CONSTRAINT "Premio_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rifa" ADD CONSTRAINT "Rifa_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "Organizador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organizador" ADD CONSTRAINT "Organizador_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bilhete" ADD CONSTRAINT "Bilhete_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bilhete" ADD CONSTRAINT "Bilhete_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sorteio" ADD CONSTRAINT "Sorteio_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sorteio" ADD CONSTRAINT "Sorteio_vencedorId_fkey" FOREIGN KEY ("vencedorId") REFERENCES "Participante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_bilheteId_fkey" FOREIGN KEY ("bilheteId") REFERENCES "Bilhete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremioParticipante" ADD CONSTRAINT "PremioParticipante_premioId_fkey" FOREIGN KEY ("premioId") REFERENCES "Premio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremioParticipante" ADD CONSTRAINT "PremioParticipante_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteioBilhete" ADD CONSTRAINT "SorteioBilhete_sorteioId_fkey" FOREIGN KEY ("sorteioId") REFERENCES "Sorteio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteioBilhete" ADD CONSTRAINT "SorteioBilhete_bilheteId_fkey" FOREIGN KEY ("bilheteId") REFERENCES "Bilhete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
