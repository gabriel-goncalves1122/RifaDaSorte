import { PrismaClient, StatusRifa, StatusBil, StatusPag, MetodoPag } from '../generated/prisma';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE "PremioParticipante", "SorteioBilhete", "Pagamento", "Bilhete", "Sorteio", "Premio", "Rifa", "Participante", "Organizador", "Usuario", "Notificacao", "LogAuditoria" CASCADE`;

  // Hash todas as senhas antes de criar os usuários
  const usuariosData = [
    // Organizadores
    { 
      nome: "Lucas Oliveira Silva", 
      email: "lucas.oliveira@rifasonline.com.br", 
      cpf: "12345678909",
      senha: await hashPassword("senha123")
    },
    { 
      nome: "Mariana Costa Santos", 
      email: "mariana.costa@sorteioscreativos.com.br", 
      cpf: "98765432100",
      senha: await hashPassword("senha123")
    },
    
    // Participantes
    { 
      nome: "Carlos Eduardo Pereira", 
      email: "carlos.pereira@gmail.com", 
      cpf: "11122233344",
      senha: await hashPassword("senha123")
    },
    { 
      nome: "Ana Carolina Ribeiro", 
      email: "ana.ribeiro@outlook.com", 
      cpf: "22233344455",
      senha: await hashPassword("senha123")
    },
    { 
      nome: "Roberto Almeida Souza", 
      email: "roberto.souza@yahoo.com.br", 
      cpf: "33344455566",
      senha: await hashPassword("senha123")
    },
    { 
      nome: "Juliana Martins Ferreira", 
      email: "juliana.ferreira@hotmail.com", 
      cpf: "44455566677",
      senha: await hashPassword("senha123")
    },
    { 
      nome: "Fernando Henrique Lima", 
      email: "fernando.lima@protonmail.com", 
      cpf: "55566677788",
      senha: await hashPassword("senha123")
    },
  ];


  const organizadoresData = [
    { 
      cnpj: "12345678000195", 
      razaoSocial: "Rifas Online LTDA" 
    },
    { 
      cnpj: "98765432000110", 
      razaoSocial: "Sorteios Criativos ME" 
    }
  ];

  // Criar usuários (agora com senhas hasheadas)
  const usuarios = await Promise.all(
    usuariosData.map((user) => 
      prisma.usuario.create({
        data: {
          nome: user.nome,
          email: user.email,
          cpf: user.cpf,
          senha: user.senha, // Já está hasheado
          createdAt: new Date()
        }
      })
    )
  );

  // Criar organizadores
  const [organizador1, organizador2] = await Promise.all([
    prisma.organizador.create({
      data: {
        cnpj: organizadoresData[0].cnpj.replace(/\D/g, ''),
        userId: usuarios[0].id,
      },
    }),
    prisma.organizador.create({
      data: {
        cnpj: organizadoresData[1].cnpj.replace(/\D/g, ''),
        userId: usuarios[1].id,
      },
    }),
  ]);

  // Criar participantes
  const participantes = await Promise.all(
    usuarios.slice(2).map(usuario => 
      prisma.participante.create({ 
        data: { userId: usuario.id } 
      })
    )
  );

  // Criar prêmios
  const premios = [
    {
      nome: "iPhone 15 Pro",
      descricao: "Novo iPhone 15 Pro 256GB",
      imagem: "https://example.com/iphone.jpg"
    },
    {
      nome: "PlayStation 5",
      descricao: "Console PS5 com 1 controle",
      imagem: "https://example.com/ps5.jpg"
    }
  ];

  // Criar rifas
  const rifas = await Promise.all([
    prisma.rifa.create({
      data: {
        titulo: "Rifa do iPhone",
        descricao: "Concorra a um iPhone 15 Pro",
        precoBilhete: 10.50,
        quantidadeBilhetes: 50,
        dataSorteio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias no futuro
        status: StatusRifa.Ativa,
        organizadorId: organizador1.id,
        premio: {
          create: premios[0]
        }
      },
      include: { premio: true }
    }),
    prisma.rifa.create({
      data: {
        titulo: "Rifa do PlayStation",
        descricao: "Concorra a um PS5",
        precoBilhete: 15.00,
        quantidadeBilhetes: 50,
        dataSorteio: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 dias no futuro
        status: StatusRifa.Ativa,
        organizadorId: organizador2.id,
        premio: {
          create: premios[1]
        }
      },
      include: { premio: true }
    }),
  ]);

  // Criar bilhetes e vendas
  for (const rifa of rifas) {
    // Criar bilhetes disponíveis
    const bilhetesDisponiveis = Array.from({ length: rifa.quantidadeBilhetes }, (_, i) => ({
      numero: i + 1,
      status: StatusBil.Disponivel,
      rifaId: rifa.id,
      createdAt: new Date(),
    }));

    await prisma.bilhete.createMany({ data: bilhetesDisponiveis });

    // Cada participante compra 10 bilhetes de cada rifa
    for (const participante of participantes) {
      const bilhetesParaComprar = await prisma.bilhete.findMany({
        where: {
          rifaId: rifa.id,
          status: StatusBil.Disponivel
        },
        take: 10,
        orderBy: { id: 'asc' }
      });

     await Promise.all(
  bilhetesParaComprar.map((bilhete: { id: number }) => 
    prisma.bilhete.update({
      where: { id: bilhete.id },
      data: {
        status: StatusBil.Vendido, // Certifique-se que o enum está importado corretamente
        participanteId: participante.id,
        pagamento: {
          create: {
            valor: rifa.precoBilhete,
            status: StatusPag.APROVADO,
            metodo: MetodoPag.PIX,
            participanteId: participante.id,
            dataProcessamento: new Date()
          }
        }
      }
    })
  )
);
    }
  }

  await prisma.logAuditoria.createMany({
    data: [
      {
        acao: "Rifa criada",
        detalhes: "Rifa do iPhone foi criada com sucesso",
        rifaId: rifas[0].id
      },
      {
        acao: "Rifa criada",
        detalhes: "Rifa do PlayStation foi criada com sucesso",
        rifaId: rifas[1].id
      }
    ]
  });

  await prisma.notificacao.createMany({
    data: participantes.flatMap(participante => [
      {
        mensagem: "Você comprou bilhetes para a Rifa do iPhone!",
        tipo: "COMPRA",
        destinatarioId: participante.userId
      },
      {
        mensagem: "Você comprou bilhetes para a Rifa do PlayStation!",
        tipo: "COMPRA",
        destinatarioId: participante.userId
      }
    ])
  });

  //console.log("✅ Seed concluído com sucesso!");
  //console.log(`- Organizadores: ${organizadoresData.map(o => o.razaoSocial).join(', ')}`);
  //console.log(`- Participantes: ${participantes.length} cadastrados`);
  //console.log(`- Rifas criadas: ${rifas.map(r => r.titulo).join(', ')}`);
  //console.log(`- Bilhetes vendidos: ${participantes.length * 20} no total (10 por rifa)`);
}

main()
  .catch(e => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });