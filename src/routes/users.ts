import { Router } from "express";
import {
  authenticateUser,
  createUser,
  validateUser,
} from "../controllers/users";
import { withAuthentication } from "@frontegg/client";

const router = Router();

router.get("/users", withAuthentication(), authenticateUser);
router.post("/users", createUser);
router.post("/access-token", validateUser);

export { router as UsersRouter };
