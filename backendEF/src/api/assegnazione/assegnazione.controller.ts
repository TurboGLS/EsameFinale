import { NextFunction, Response } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddAssegnazioneDTO, UpdateAssegnazioneDTO } from "./assegnazione.dto";
import { StatoAssegnazione, STATI_ASSEGNAZIONE } from "./assegnazione.entity";
import assegnazioneSrv, {
    AssegnazioneFilters,
    AssegnazioneValidationError,
    TransizioneNonValidaError,
    CurrentUser
} from "./assegnazione.service";

// ricavo l'utente corrente dalla request autenticata
const current = (req: TypedRequest): CurrentUser => ({ id: req.user!.id, ruolo: req.user!.ruolo });

const handleBusinessError = (err: unknown, res: Response, next: NextFunction) => {
    if (err instanceof AssegnazioneValidationError) {
        res.status(400).json({ error: err.name, message: err.message });
        return;
    }
    if (err instanceof TransizioneNonValidaError) {
        res.status(409).json({ error: err.name, message: err.message });
        return;
    }
    next(err);
}

// elenco con filtri (il dipendente vede solo le proprie)
export const getAll = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        const filters: AssegnazioneFilters = {};
        if (req.query.stato && STATI_ASSEGNAZIONE.includes(req.query.stato as StatoAssegnazione)) {
            filters.stato = req.query.stato as StatoAssegnazione;
        }
        if (req.query.categoria) filters.categoria = String(req.query.categoria);
        if (req.query.corso) filters.corso = String(req.query.corso);
        if (req.query.dipendente) filters.dipendente = String(req.query.dipendente);

        const assegnazioni = await assegnazioneSrv.all(filters, current(req));
        res.json(assegnazioni);
    } catch (err) {
        next(err);
    }
}

// dettaglio assegnazione
export const getById = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        const assegnazione = await assegnazioneSrv.getById(String(req.params.id), current(req));
        res.json(assegnazione);
    } catch (err) {
        next(err);
    }
}

//  creazione solo referente
export const create = async (req: TypedRequest<AddAssegnazioneDTO>, res: Response, next: NextFunction) => {
    try {
        const assegnazione = await assegnazioneSrv.add(req.body);
        res.status(201).json(assegnazione);
    } catch (err) {
        handleBusinessError(err, res, next);
    }
}

// modifica solo referente
export const update = async (req: TypedRequest<UpdateAssegnazioneDTO>, res: Response, next: NextFunction) => {
    try {
        const assegnazione = await assegnazioneSrv.update(String(req.params.id), req.body);
        res.json(assegnazione);
    } catch (err) {
        handleBusinessError(err, res, next);
    }
}

// completamento per dipendente proprietario o referente
export const completa = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        const assegnazione = await assegnazioneSrv.completa(String(req.params.id), current(req));
        res.json(assegnazione);
    } catch (err) {
        handleBusinessError(err, res, next);
    }
}

// annullamento solo per il referente
export const annulla = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        const assegnazione = await assegnazioneSrv.annulla(String(req.params.id));
        res.json(assegnazione);
    } catch (err) {
        handleBusinessError(err, res, next);
    }
}

// eliminazione solo per il referente
export const remove = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        await assegnazioneSrv.remove(String(req.params.id));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
