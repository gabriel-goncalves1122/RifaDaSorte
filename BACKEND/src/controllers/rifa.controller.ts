import { Request, Response } from "express";
import { RifaRepository } from "../repositories/rifa.repository";

export default class RifaController {
  private repository = new RifaRepository();

  async listar(req: Request, res: Response) {
    try {
      console.log("Iniciando busca de rifas...");
      const rifas = await this.repository.listar();
      console.log("Rifas encontradas:", rifas);
      res.json(rifas);
    } catch (error) {
      console.error("Erro completo:", error);
      res.status(500).json({ error: "Erro ao listar rifas" });
    }
  }

  async obterPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const rifa = await this.repository.obterPorId(id);
      rifa ? res.json(rifa) : res.status(404).json({ error: "Não encontrado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar rifa" });
    }
  }
  async criar(req: Request, res: Response) {
    try {
      const novaRifa = await this.repository.criar(req.body);
      res.status(201).json(novaRifa);
    } catch (error) {
      res.status(400).json({ error: "Erro ao criar rifa" });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const rifaAtualizada = await this.repository.atualizar(
        Number(req.params.id),
        req.body
      );
      res.json(rifaAtualizada);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar rifa" });
    }
  }

  async remover(req: Request, res: Response) {
    try {
      await this.repository.remover(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao remover rifa" });
    }
  }

  /*async sortear(req: Request, res: Response) {
    try {
      const vencedor = await this.repository.sortear(Number(req.params.id));
      res.json(vencedor);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao sortear rifa' });
    }
  }*/
}
