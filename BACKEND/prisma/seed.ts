import {
  PrismaClient,
  StatusRifa,
  StatusBil,
  StatusPag,
  MetodoPag,
} from "../generated/prisma";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

async function clearDatabase() {
  await prisma.$executeRaw`TRUNCATE TABLE 
    "PremioParticipante", 
    "SorteioBilhete", 
    "Pagamento", 
    "Bilhete", 
    "Sorteio", 
    "Premio", 
    "Rifa", 
    "Participante", 
    "Organizador", 
    "Usuario", 
    "Notificacao",
    "LogAuditoria"
    CASCADE`;
  console.log("🔄 Banco de dados limpo com sucesso!");
}

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE "PremioParticipante", "SorteioBilhete", "Pagamento", "Bilhete", "Sorteio", "Premio", "Rifa", "Participante", "Organizador", "Usuario", "Notificacao", "LogAuditoria"`;

  await clearDatabase();

  // Hash todas as senhas antes de criar os usuários
  const usuariosData = [
    // Organizadores
    {
      nome: "Gabriel Gonçalves Sampaio",
      email: "gabrielsampaio059@gmail.com",
      cpf: "12345678909",
      senha: await hashPassword("senha123"),
    },
    {
      nome: "Mariana Costa Santos",
      email: "mariana.costa@sorteioscreativos.com.br",
      cpf: "98765432100",
      senha: await hashPassword("senha123"),
    },

    // Participantes
    {
      nome: "Carlos Eduardo Pereira",
      email: "carlos.pereira@gmail.com",
      cpf: "11122233344",
      senha: await hashPassword("senha123"),
    },
    {
      nome: "Ana Carolina Ribeiro",
      email: "ana.ribeiro@outlook.com",
      cpf: "22233344455",
      senha: await hashPassword("senha123"),
    },
    {
      nome: "Roberto Almeida Souza",
      email: "roberto.souza@yahoo.com.br",
      cpf: "33344455566",
      senha: await hashPassword("senha123"),
    },
    {
      nome: "Juliana Martins Ferreira",
      email: "juliana.ferreira@hotmail.com",
      cpf: "44455566677",
      senha: await hashPassword("senha123"),
    },
    {
      nome: "Fernando Henrique Lima",
      email: "fernando.lima@protonmail.com",
      cpf: "55566677788",
      senha: await hashPassword("senha123"),
    },
  ];

  const organizadoresData = [
    {
      cnpj: "12345678000195",
      razaoSocial: "Rifas Online LTDA",
    },
    {
      cnpj: "98765432000110",
      razaoSocial: "Sorteios Criativos ME",
    },
  ];

  // Criar usuários
  const usuarios = await Promise.all(
    usuariosData.map((user) =>
      prisma.usuario.create({
        data: {
          nome: user.nome,
          email: user.email,
          cpf: user.cpf,
          senha: user.senha,
          createdAt: new Date(),
        },
      })
    )
  );

  // Criar organizadores
  const [organizador1, organizador2] = await Promise.all([
    prisma.organizador.create({
      data: {
        cnpj: organizadoresData[0].cnpj.replace(/\D/g, ""),
        userId: usuarios[0].id,
      },
    }),
    prisma.organizador.create({
      data: {
        cnpj: organizadoresData[1].cnpj.replace(/\D/g, ""),
        userId: usuarios[1].id,
      },
    }),
  ]);

  // Criar participantes
  const participantes = await Promise.all(
    usuarios.slice(2).map((usuario) =>
      prisma.participante.create({
        data: { userId: usuario.id },
      })
    )
  );

  // Criar todos os prêmios (7 no total - 2 originais + 5 novos)
  const premios = [
    // Prêmios originais
    {
      nome: "iPhone 15 Pro",
      descricao: "Novo iPhone 15 Pro 256GB",
      imagem: "https://example.com/iphone.jpg",
    },
    {
      nome: "PlayStation 5",
      descricao: "Console PS5 com 1 controle",
      imagem: "https://example.com/ps5.jpg",
    },
    // Novos prêmios
    {
      nome: "Notebook Dell XPS 15",
      descricao: "Notebook Dell XPS 15 com tela 4K, 16GB RAM, 512GB SSD",
      imagem: "https://example.com/dellxps.jpg",
    },
    {
      nome: "Viagem para Fernando de Noronha",
      descricao: "Pacote de viagem para 2 pessoas com hospedagem de 5 dias",
      imagem: "https://example.com/noronha.jpg",
    },
    {
      nome: 'Smart TV Samsung 75" QLED',
      descricao: "Smart TV Samsung 75 polegadas 4K QLED",
      imagem: "https://example.com/samsungtv.jpg",
    },
    {
      nome: "Moto Honda CB 500F",
      descricao: "Moto Honda CB 500F 0km, cor vermelha",
      imagem: "https://example.com/hondacb500.jpg",
    },
    {
      nome: "Kit Gamer Completo",
      descricao: "PC Gamer + Monitor + Periféricos + Cadeira",
      imagem: "https://example.com/kitgamer.jpg",
    },
  ];

  // Criar todas as rifas (7 no total - 2 originais + 5 novas)
  const rifas = await Promise.all([
    // Rifas originais
    prisma.rifa.create({
      data: {
        titulo: "Rifa do iPhone",
        descricao: "Concorra a um iPhone 15 Pro",
        precoBilhete: 10.5,
        quantidadeBilhetes: 50,
        dataSorteio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        status: StatusRifa.Ativa,
        organizadorId: organizador1.id,
        premio: {
          create: premios[0],
        },
      },
      include: { premio: true },
    }),
    prisma.rifa.create({
      data: {
        titulo: "Rifa do PlayStation",
        descricao: "Concorra a um PS5",
        precoBilhete: 15.0,
        quantidadeBilhetes: 50,
        dataSorteio: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 dias
        status: StatusRifa.Ativa,
        organizadorId: organizador2.id,
        premio: {
          create: premios[1],
        },
      },
      include: { premio: true },
    }),
    // Novas rifas
    prisma.rifa.create({
      data: {
        titulo: "Rifa do Notebook Dell",
        descricao: "Concorra a um Notebook Dell XPS 15 top de linha",
        precoBilhete: 12.0,
        quantidadeBilhetes: 100,
        dataSorteio: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias
        status: StatusRifa.Ativa,
        organizadorId: organizador1.id,
        premio: {
          create: premios[2],
        },
      },
      include: { premio: true },
    }),
    prisma.rifa.create({
      data: {
        titulo: "Rifa da Viagem",
        descricao: "Concorra a uma viagem para Fernando de Noronha",
        precoBilhete: 25.0,
        quantidadeBilhetes: 200,
        dataSorteio: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
        status: StatusRifa.Ativa,
        organizadorId: organizador2.id,
        premio: {
          create: premios[3],
        },
      },
      include: { premio: true },
    }),
    prisma.rifa.create({
      data: {
        titulo: "Rifa da TV Samsung",
        descricao: 'Concorra a uma Smart TV Samsung 75" QLED',
        precoBilhete: 8.5,
        quantidadeBilhetes: 150,
        dataSorteio: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 dias
        status: StatusRifa.Ativa,
        organizadorId: organizador1.id,
        premio: {
          create: premios[4],
        },
      },
      include: { premio: true },
    }),
    prisma.rifa.create({
      data: {
        titulo: "Rifa da Moto Honda",
        descricao: "Concorra a uma Moto Honda CB 500F 0km",
        precoBilhete: 20.0,
        quantidadeBilhetes: 300,
        dataSorteio: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 dias
        status: StatusRifa.Ativa,
        organizadorId: organizador2.id,
        premio: {
          create: premios[5],
        },
      },
      include: { premio: true },
    }),
    prisma.rifa.create({
      data: {
        titulo: "Rifa do Kit Gamer",
        descricao: "Concorra a um Kit Gamer completo",
        precoBilhete: 15.0,
        quantidadeBilhetes: 180,
        dataSorteio: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 dias
        status: StatusRifa.Ativa,
        organizadorId: organizador1.id,
        premio: {
          create: premios[6],
        },
      },
      include: { premio: true },
    }),
  ]);

  for (const rifa of rifas) {
    const organizador = await prisma.organizador.findUnique({
      where: { id: rifa.organizadorId },
      include: { usuario: true },
    });

    if (organizador) {
      await prisma.logAuditoria.create({
        data: {
          acao: "CRIAÇÃO_DE_RIFA",
          detalhes: `Rifa "${rifa.titulo}" criada com ${rifa.quantidadeBilhetes} bilhetes`,
          rifaId: rifa.id,
          usuarioId: organizador.usuario.id,
        },
      });
    }
  }
  // Criar bilhetes e vendas para todas as rifas
  for (const rifa of rifas) {
    // Criar bilhetes disponíveis
    const bilhetesDisponiveis = Array.from(
      { length: rifa.quantidadeBilhetes },
      (_, i) => ({
        numero: i + 1,
        status: StatusBil.Disponivel,
        rifaId: rifa.id,
        createdAt: new Date(),
      })
    );

    await prisma.bilhete.createMany({ data: bilhetesDisponiveis });

    // Definir quantidade de bilhetes que cada participante comprará
    const bilhetesPorParticipante =
      rifa.precoBilhete > 15
        ? 3 // Rifas mais caras: 3 bilhetes
        : rifa.precoBilhete > 10
        ? 5 // Rifas médias: 5 bilhetes
        : 10; // Rifas mais baratas: 10 bilhetes

    // Cada participante compra bilhetes
    for (const participante of participantes) {
      const bilhetesParaComprar = await prisma.bilhete.findMany({
        where: {
          rifaId: rifa.id,
          status: StatusBil.Disponivel,
        },
        take: bilhetesPorParticipante,
        orderBy: { id: "asc" },
      });

      await Promise.all(
        bilhetesParaComprar.map((bilhete: { id: number }) =>
          prisma.bilhete.update({
            where: { id: bilhete.id },
            data: {
              status: StatusBil.Vendido,
              participanteId: participante.id,
              pagamento: {
                create: {
                  valor: rifa.precoBilhete,
                  status: StatusPag.APROVADO,
                  metodo: MetodoPag.PIX,
                  participanteId: participante.id,
                  dataProcessamento: new Date(),
                },
              },
            },
          })
        )
      );
    }
  }

  for (const rifa of rifas) {
    const bilhetesVendidos = await prisma.bilhete.count({
      where: {
        rifaId: rifa.id,
        status: StatusBil.Vendido,
      },
    });

    await prisma.logAuditoria.create({
      data: {
        acao: "VENDAS_DE_BILHETES",
        detalhes: `${bilhetesVendidos} bilhetes vendidos para a rifa "${rifa.titulo}"`,
        rifaId: rifa.id,
      },
    });
  }

  // Criar notificações
  await prisma.notificacao.createMany({
    data: participantes.flatMap((participante) =>
      rifas.map((rifa) => ({
        mensagem: `Você comprou bilhetes para a ${rifa.titulo}!`,
        tipo: "COMPRA",
        destinatarioId: participante.userId,
      }))
    ),
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
