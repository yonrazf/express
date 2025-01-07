import { Router } from "express";
import { authenticateUser } from "../controllers/users";

const router = Router();

router.get("/users", authenticateUser);

export { router as UsersRouter };
