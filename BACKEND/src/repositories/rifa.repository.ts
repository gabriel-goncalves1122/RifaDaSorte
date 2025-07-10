import { PrismaClient, Rifa, StatusRifa } from "../../generated/prisma";

type CriarRifaInput = {
  titulo: string;
  descricao: string;
  precoBilhete: number;
  quantidadeBilhetes: number;
  dataSorteio: Date;
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
    const ORGANIZADOR_FIXO_ID = 23;
    try {
      // Verifica se o organizador existe
      const organizador = await prisma.organizador.findUnique({
        where: { id: ORGANIZADOR_FIXO_ID },
      });

      if (!organizador) {
        throw new Error(
          `Organizador fixo com ID ${ORGANIZADOR_FIXO_ID} não encontrado`
        );
      }

      // Cria a rifa com o organizador fixo
      return await prisma.rifa.create({
        data: {
          titulo: data.titulo,
          descricao: data.descricao,
          precoBilhete: data.precoBilhete,
          quantidadeBilhetes: data.quantidadeBilhetes,
          dataSorteio: data.dataSorteio,
          organizadorId: ORGANIZADOR_FIXO_ID, // Usando o ID fixo aqui
          status: StatusRifa.Ativa,
        },
      });
    } catch (error) {
      console.error("Erro ao criar rifa:", error);
      throw new Error(`Falha ao criar rifa: ${error}`);
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
      },
    });
  }
  async remover(id: number): Promise<void> {
    try {
      // Verifica se a rifa existe
      const rifaExistente = await prisma.rifa.findUnique({
        where: { id },
        include: {
          bilhetes: {
            include: {
              pagamento: true,
            },
          },
        },
      });

      if (!rifaExistente) {
        throw new Error("Rifa não encontrada");
      }

      // Exclui manualmente os pagamentos primeiro (se necessário)
      if (rifaExistente.bilhetes.length > 0) {
        const pagamentoIds = rifaExistente.bilhetes
          .filter((b) => b.pagamento !== null)
          .map((b) => b.pagamento!.id);

        if (pagamentoIds.length > 0) {
          await prisma.pagamento.deleteMany({
            where: { id: { in: pagamentoIds } },
          });
        }
      }

      // Exclusão em cascata cuidará dos demais relacionamentos
      await prisma.rifa.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Erro detalhado ao excluir rifa:", error);
      if (error instanceof Error) {
        throw new Error(`Falha ao excluir rifa: ${error.message}`);
      }
      throw new Error("Erro desconhecido ao excluir rifa");
    }
  }
}

export default new RifaRepository();
