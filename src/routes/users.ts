import { Router } from "express";
import { authenticateUser, createUser } from "../controllers/users";

const router = Router();

router.get("/users", authenticateUser);
router.post("/users", createUser);

export { router as UsersRouter };
