import { Router } from "express";
import authRouter from "./auth.routes";
import rifaRouter from "./rifa.routes";

const router = Router();

// Rotas públicas
router.use("/auth", authRouter);

// Rotas protegidas (requerem autenticação)
router.use("/rifas", rifaRouter); // Todas as rotas de rifas exigirão auth

export default router;
