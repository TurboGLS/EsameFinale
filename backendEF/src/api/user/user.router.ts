import { Router } from "express";
import { validate } from "../../lib/validation-middleware";
import { isAuthenticated } from "../../lib/auth/auth.middlware";
import { me } from "./user.controller";

const router = Router();

router.get('/me', isAuthenticated, me)

export default router;