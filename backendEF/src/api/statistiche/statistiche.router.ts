import { Router } from "express";
import { isAuthenticated, hasRole } from "../../lib/auth/auth.middlware";
import { academy } from "./statistiche.controller";

const router = Router();

router.get('/academy', isAuthenticated, hasRole('REFERENTE'), academy);

export default router;
