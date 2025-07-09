import { Request, Response } from "express";
import BilheteRepository from "../repositories/bilhete.repository";

export default class BilheteController {
  private repository = new BilheteRepository();

  async comprar(req: Request, res: Response) {
    try {
      const bilhete = await this.repository.comprar(
        Number(req.body.rifaId),
        Number(req.body.participanteId)
      );
      res.status(201).json(bilhete);
    } catch (error) {
      res.status(400).json({ error: "Erro ao comprar bilhete" });
    }
  }

  async obterPorId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const bilhete = await this.repository.obterPorId(id);
      if (!bilhete) res.status(404).json({ error: "Bilhete não encontrado" });
      res.json(bilhete);
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter bilhete" });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      // Opção 1: Listar todos os bilhetes
      const bilhetes = await this.repository.listar();

      if (!bilhetes || bilhetes.length === 0) {
        res.status(404).json({ message: "Nenhum bilhete encontrado" });
      }

      res.json(bilhetes);
    } catch (error) {
      console.error("Erro ao listar bilhetes:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno ao listar bilhetes",
      });
    }
  }
}
