import { Router } from "express";
import { cteController } from "../controllers/cteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Todas as rotas de CTE serão protegidas pelo token
router.use(authMiddleware);
router.get("/reports/financial", cteController.getFinancialReport);

router.post("/", cteController.register);
router.get("/", cteController.list);
router.put("/:id", cteController.update);
router.delete("/:id", cteController.remove);

export default router;