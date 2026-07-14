import { Router } from "express";
import { validate } from "../../lib/validation-middleware";
import { isAuthenticated, hasRole } from "../../lib/auth/auth.middlware";
import { AddCategoriaDTO } from "./categoria.dto";
import { getAllCategorie, createCategoria } from "./categoria.controller";

const router = Router();

// elenco categorie per tutti
router.get('/', isAuthenticated, getAllCategorie);
// creazione categoria solo per i referenti
router.post('/', isAuthenticated, hasRole('REFERENTE'), validate(AddCategoriaDTO), createCategoria);

export default router;
