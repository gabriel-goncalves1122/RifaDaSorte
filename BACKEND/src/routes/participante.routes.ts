import { Router } from 'express';
import ParticipanteController from '../controllers/participante.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new ParticipanteController();

// Rotas públicas
//router.post('/', controller.criar); // Criação pode ser pública


router.get('/', controller.listar);
router.get('/:id', controller.obterPorId);
router.get('/:id/bilhetes', controller.listarBilhetes);

export default router;