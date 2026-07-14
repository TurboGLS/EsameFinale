import { NextFunction, Response } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddCorsoDTO, UpdateCorsoDTO } from "./corso.dto";
import corsoSrv, { CorsoFilters, CorsoHasAssegnazioniError } from "./corso.service";

// elenco con filtri opzionali per categoria e stato attivo
export const getAll = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const filters: CorsoFilters = {};
        if (req.query.categoria) {
            filters.categoria = String(req.query.categoria);
        }
        if (req.query.attivo !== undefined) {
            filters.attivo = req.query.attivo === 'true';
        }
        const corsi = await corsoSrv.all(filters);
        res.json(corsi);
    } catch (err) {
        next(err);
    }
}

// dettaglio del corso
export const getById = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const corso = await corsoSrv.getById(String(req.params.id));
        res.json(corso);
    } catch (err) {
        next(err);
    }
}

// creazione solo per il referente
export const create = async (
    req: TypedRequest<AddCorsoDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const corso = await corsoSrv.add(req.body as any);
        res.status(201).json(corso);
    } catch (err) {
        next(err);
    }
}

// modifica solo per il referente
export const update = async (
    req: TypedRequest<UpdateCorsoDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const corso = await corsoSrv.update(String(req.params.id), req.body as any);
        res.json(corso);
    } catch (err) {
        next(err);
    }
}

// disattivazione solo per il referente
export const disattiva = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const corso = await corsoSrv.disattiva(String(req.params.id));
        res.json(corso);
    } catch (err) {
        next(err);
    }
}

// eliminazione solo per il referente e se non ha assegnazioni
export const remove = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        await corsoSrv.remove(String(req.params.id));
        res.status(204).send();
    } catch (err) {
        if (err instanceof CorsoHasAssegnazioniError) {
            res.status(409).json({ error: err.name, message: err.message });
            return;
        }
        next(err);
    }
}
