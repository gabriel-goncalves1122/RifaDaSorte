import { PrismaClient, Usuario } from '../../generated/prisma';
const prisma = new PrismaClient();

export default class AuthRepository{ 
    async obterPorEmail(email:string):Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { email: email} });
}};