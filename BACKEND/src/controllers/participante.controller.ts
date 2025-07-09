import { Request, Response } from 'express';
import ParticipanteRepository from '../repositories/participante.repository';

export default class ParticipanteController {
  private repository = new ParticipanteRepository();

  async listar(req: Request, res: Response){
    try {
      const participantes = await this.repository.listar();
      
      if (!participantes || participantes.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Nenhum participante encontrado'
        });
      }

      else{ res.json({
        success: true,
        count: participantes.length,
        data: participantes
      });
    }

    } catch (error) {
      console.error('Erro no controller (listar participantes):', error);
      res.status(500).json({
        success: false,
        error: 'Falha ao carregar participantes',
      });
    }
  }


  async obterPorId(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const participante = await this.repository.obterPorId(id);
      participante ? res.json(participante) : res.status(404).json({ error: 'Não encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar participante' });
    }
  }

  async listarBilhetes(req: Request, res: Response) {
    try {
      const bilhetes = await this.repository.listarBilhetes(Number(req.params.id));
      res.json(bilhetes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar bilhetes' });
    }
  }
}