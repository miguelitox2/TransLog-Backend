import { Router } from "express";
import { clientController } from "../controllers/clientController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", clientController.register);
router.get("/", clientController.list);
router.put("/:id", clientController.update);
router.delete("/:id", clientController.remove);

export default router;