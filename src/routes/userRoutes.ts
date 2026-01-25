import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { branchController } from "../controllers/branchController";

const router = Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", authMiddleware, userController.listAll);
router.get("/list", authMiddleware, userController.listAll);

router.get("/branches", authMiddleware, branchController.list);
router.post("/branches", authMiddleware, branchController.create);

export default router;
