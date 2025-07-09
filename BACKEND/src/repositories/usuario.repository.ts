import { PrismaClient, Usuario } from '../../generated/prisma';
const prisma = new PrismaClient();

export default class UsuarioRepository {
    async criar(usuario: Omit<Usuario, 'id' | 'createdAt'>) {
        return prisma.usuario.create({
            data: {
                ...usuario,
                createdAt: new Date(),
            },
            select: {
                id: true,
                nome: true,
                email: true,
                senha:true,
                createdAt: true
            }
        });
    }

    async obterPorId(id: number): Promise<Usuario | null> {
        return prisma.usuario.findUnique({
            where: { id }
        });
    }

   /* async obterPorEmailComSenha(email: string):Promise<Usuario | null> {
        return prisma.usuario.findUnique({
            where: { email },
        });
    }*/

    async obterPorEmail(email: string): Promise<Usuario | null> {
        return prisma.usuario.findUnique({
            where: { email },
           
        });
    }

    async listar() : Promise<Usuario[]> {
        return prisma.usuario.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    /*async atualizar(id: number, dados: Partial<Omit<Usuario, 'id' | 'senha'>>) {
        return prisma.usuario.update({
            where: { id },
            data: dados,
            select: {
                id: true,
                nome: true,
                email: true
            }
        });
    }*/

    /*async atualizarSenha(id: number, novaSenha: string) {
        return prisma.usuario.update({
            where: { id },
            data: { senha: novaSenha },
            select: {
                id: true,
                nome: true,
                email: true
            }
        });
    }

    async remover(id: number) {
        return prisma.usuario.delete({
            where: { id }
        });
    }*/
};