import { PrismaClient ,Participante, Bilhete} from '../../generated/prisma';

const prisma = new PrismaClient();

export default class ParticipanteRepository {
  async listar(): Promise<Participante[]> {
    try {
      return await prisma.participante.findMany();
    } catch (error) {
      console.error('Erro no repository (listar participantes):', error);
      throw error;
    }
  }

  async obterPorId(id: number): Promise<Participante | null> {
    return prisma.participante.findUnique({
      where: { id },
      include: { usuario: true, bilhetes: true }
    });
  }

  async listarBilhetes(participanteId: number): Promise<Bilhete[] | null> {
    return prisma.bilhete.findMany({
      where: { participanteId },
      include: { rifa: true }
    });
  }
}