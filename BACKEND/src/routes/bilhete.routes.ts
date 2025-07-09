import { Router } from 'express';
import BilheteController from '../controllers/bilhete.controller';

const router = Router();
const controller = new BilheteController();


router.get('/', controller.listar);
router.post('/', controller.comprar);
router.get('/:id', controller.obterPorId);

export default router;