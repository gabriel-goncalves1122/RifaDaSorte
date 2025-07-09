import { PrismaClient, Bilhete } from "../../generated/prisma/index";

const prisma = new PrismaClient();

export default class BilheteRepository {
  async comprar(rifaId: number, participanteId: number): Promise<Bilhete> {
    return prisma.bilhete.update({
      where: { id: rifaId },
      data: {
        status: "Vendido",
        participanteId,
        pagamento: {
          create: {
            valor: 10.5,
            status: "APROVADO",
            metodo: "PIX",
            participanteId,
          },
        },
      },
    });
  }

  async obterPorId(id: number): Promise<Bilhete | null> {
    return prisma.bilhete.findUnique({
      where: { id },
      include: { rifa: true, participante: true },
    });
  }

  // bilhete.repository.ts
  async listar(): Promise<Bilhete[]> {
    return prisma.bilhete.findMany({});
  }

  async contarTotal() {
    return prisma.bilhete.count();
  }

  // Se for usar a opção 3 (listar por usuário)
  async listarPorUsuario(usuarioId: number) {
    return prisma.bilhete.findMany({
      where: { participanteId: usuarioId },
      include: {
        rifa: true,
      },
    });
  }
}
