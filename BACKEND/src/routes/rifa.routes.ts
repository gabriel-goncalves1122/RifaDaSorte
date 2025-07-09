import { Router } from "express";
import RifaController from "../controllers/rifa.controller"; // Importe o controller
import { authMiddleware } from "../middlewares/auth.middleware";

// Crie a instância do controller
const rifaController = new RifaController();

const router = Router();

// Rotas protegidas por autenticação
router.get("/", authMiddleware, (req, res) => rifaController.listar(req, res));
router.get("/:id", authMiddleware, (req, res) =>
  rifaController.obterPorId(req, res)
);
router.post("/", authMiddleware, (req, res) => rifaController.criar(req, res));
router.put("/:id", authMiddleware, (req, res) =>
  rifaController.atualizar(req, res)
);
router.delete("/:id", authMiddleware, (req, res) =>
  rifaController.remover(req, res)
);

export default router;
