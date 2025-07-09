import { PrismaClient, Rifa, StatusRifa } from "../../generated/prisma";

type CriarRifaInput = {
  titulo: string;
  descricao: string;
  precoBilhete: number;
  quantidadeBilhetes: number;
  dataSorteio?: Date;
  status?: StatusRifa;
  organizadorId: number;
};

type AtualizarRifaInput = {
  titulo?: string;
  descricao?: string;
  precoBilhete?: number;
  quantidadeBilhetes?: number;
  dataSorteio?: Date;
  status?: StatusRifa;
  organizadorId?: number;
};

const prisma = new PrismaClient();

export class RifaRepository {
  async listar(): Promise<Rifa[]> {
    return prisma.rifa.findMany();
  }

  async obterPorId(id: number): Promise<Rifa | null> {
    return prisma.rifa.findUnique({
      where: { id },
    });
  }

  async criar(data: CriarRifaInput): Promise<Rifa> {
    {
      return prisma.rifa.create({
        data: {
          titulo: data.titulo,
          descricao: data.descricao,
          precoBilhete: data.precoBilhete,
          quantidadeBilhetes: data.quantidadeBilhetes,
          dataSorteio: data.dataSorteio,
          status: data.status || ("ATIVA" as StatusRifa),
          organizador: {
            connect: { id: data.organizadorId },
          },
        },
      });
    }
  }

  async atualizar(id: number, data: AtualizarRifaInput): Promise<Rifa> {
    return prisma.rifa.update({
      where: { id },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        precoBilhete: data.precoBilhete,
        quantidadeBilhetes: data.quantidadeBilhetes,
        dataSorteio: data.dataSorteio,
        status: data.status,
        organizador: data.organizadorId
          ? { connect: { id: data.organizadorId } }
          : undefined,
        // Adicionando campos atualizados/modificados se necessário
      },
    });
  }

  async remover(id: number): Promise<void> {
    await prisma.rifa.delete({
      where: { id },
    });
  }
}

export default new RifaRepository();
