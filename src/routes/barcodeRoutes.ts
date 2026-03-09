import { Router } from "express";
import { BarcodeController } from "../controllers/barcodeController";
import { authMiddleware } from "../middlewares/authMiddleware"; // Ajuste o caminho se necessário

const router = Router();
const barcodeController = new BarcodeController();

// Todas as rotas de barcode precisam de autenticação
router.use(authMiddleware);

router.post("/read", barcodeController.read);
router.get("/list", barcodeController.list);
router.post("/sync", barcodeController.syncStatus);

export default router;
