import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import  AuthRepository  from '../repositories/auth.repository';

const repository = new AuthRepository();

export const loginController = async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        res.status(400).json({ 
            success: false,
            message: 'Email e senha são obrigatórios.' 
        });
        return;
    }

    try {
        // Busca usuário por email
        const usuario = await repository.obterPorEmail(email);
        
        if (!usuario) {
            res.status(401).json({ 
                success: false,
                message: 'Credenciais inválidas.' // Mensagem genérica por segurança
            });
            return;
        }

        // Verificação de senha
        const senhaValida = await argon2.verify(usuario.senha, senha);
        
        if (!senhaValida) {
            res.status(401).json({ 
                success: false,
                message: 'Credenciais inválidas.' 
            });
            return;
        }

        // Geração do token JWT
        const token = jwt.sign(
            { 
                id: usuario.id,
                email: usuario.email,// Se houver tipo/perfil no seu modelo
            },
            process.env.JWT_SECRET || 'secret-dev-key',
            { expiresIn: '8h' } // Tempo maior de expiração
        );

        // Resposta de sucesso
        res.json({ 
            success: true,
            message: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erro interno no servidor' 
        });
    }
};