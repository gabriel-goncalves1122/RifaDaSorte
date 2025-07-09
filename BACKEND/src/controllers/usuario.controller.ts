import { Request, Response } from "express";
import UsuarioRepository from "../repositories/usuario.repository";
import argon2 from "argon2";

const usuarioRepository = new UsuarioRepository();

export default class UsuarioController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, email, senha, cpf } = req.body;

      if (!nome || !email || !senha) {
        res.status(400).json({
          success: false,
          message: "Nome, email e senha são obrigatórios",
        });
      } else {
        const senha_hash = await argon2.hash(senha);
        const novoUsuario = await usuarioRepository.criar({
          nome,
          email,
          senha: senha_hash,
          ...(cpf && { cpf }),
        });

        res.status(201).json({
          success: true,
          data: {
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            createdAt: novoUsuario.createdAt,
          },
        });
      }
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(400).json({
          success: false,
          message: "Email já cadastrado",
        });
      } else {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({
          success: false,
          message: "Erro ao criar usuário",
        });
      }
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuarios = await usuarioRepository.listar();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao listar usuários",
      });
    }
  }

  async obterPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const usuario = await usuarioRepository.obterPorId(id);

      if (!usuario) {
        res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
      } else {
        const usuarioSafe = {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          createdAt: usuario.createdAt,
        };

        res.json({
          success: true,
          data: usuarioSafe,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao buscar usuário",
      });
    }
  }

  /*async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { senha, ...dados } = req.body;

      if (senha) {
        dados.senha = await argon2.hash(senha);
      }

      const usuarioAtualizado = await usuarioRepository.atualizar(id, dados);
      
      res.json({
        success: true,
        data: usuarioAtualizado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar usuário'
      });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      await usuarioRepository.remover(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao remover usuário'
      });
    }
  }*/
}
