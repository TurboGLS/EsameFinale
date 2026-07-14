import { Router } from "express";
import { isAuthenticated, hasRole } from "../../lib/auth/auth.middlware";
import { me, getDipendenti } from "./user.controller";

const router = Router();

router.get('/me', isAuthenticated, me);

router.get('/dipendenti', isAuthenticated, hasRole('REFERENTE'), getDipendenti);

export default router;
