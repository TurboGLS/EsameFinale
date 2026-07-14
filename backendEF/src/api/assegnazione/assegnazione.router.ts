import { Router } from "express";
import { validate } from "../../lib/validation-middleware";
import { isAuthenticated, hasRole } from "../../lib/auth/auth.middlware";
import { AddAssegnazioneDTO, UpdateAssegnazioneDTO } from "./assegnazione.dto";
import { getAll, getById, create, update, completa, annulla, remove } from "./assegnazione.controller";

const router = Router();

// consultazione assegnazioni per dipendente
router.get('/', isAuthenticated, getAll);
router.get('/:id', isAuthenticated, getById);

// gestione assegnazioni solo per i referenti
router.post('/', isAuthenticated, hasRole('REFERENTE'), validate(AddAssegnazioneDTO), create);
router.put('/:id', isAuthenticated, hasRole('REFERENTE'), validate(UpdateAssegnazioneDTO), update);
router.put('/:id/annulla', isAuthenticated, hasRole('REFERENTE'), annulla);
router.delete('/:id', isAuthenticated, hasRole('REFERENTE'), remove);

// completamento consentito al dipendente proprietario e al referente
router.put('/:id/completa', isAuthenticated, completa);

export default router;
