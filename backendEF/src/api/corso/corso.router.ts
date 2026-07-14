import { Router } from "express";
import { validate } from "../../lib/validation-middleware";
import { isAuthenticated, hasRole } from "../../lib/auth/auth.middlware";
import { AddCorsoDTO, UpdateCorsoDTO } from "./corso.dto";
import { getAll, getById, create, update, disattiva, remove } from "./corso.controller";

const router = Router();

// elenco per qualsiasi utente
router.get('/', isAuthenticated, getAll);
router.get('/:id', isAuthenticated, getById);

// gestione corsi solo per referenti
router.post('/', isAuthenticated, hasRole('REFERENTE'), validate(AddCorsoDTO), create);
router.put('/:id', isAuthenticated, hasRole('REFERENTE'), validate(UpdateCorsoDTO), update);
router.put('/:id/disattiva', isAuthenticated, hasRole('REFERENTE'), disattiva);
router.delete('/:id', isAuthenticated, hasRole('REFERENTE'), remove);

export default router;
