import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const usuarioController = new UsuarioController();

const router = Router();

//router.post('/usuarios', usuarioController.criar);

router.get("/:id", usuarioController.obterPorId);
router.get("/", usuarioController.listar);
//router.put('/usuarios/:id', usuarioController.atualizar);

// Rotas apenas para administradores
//router.use(adminMiddleware);

//router.delete('/usuarios/:id', usuarioController.remover);

export default router;
