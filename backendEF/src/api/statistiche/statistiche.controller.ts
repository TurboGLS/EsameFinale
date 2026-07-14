import { NextFunction, Response } from "express";
import { TypedRequest } from "../../lib/typed-request.interface";
import statisticheSrv, { StatisticheFilters } from "./statistiche.service";

// riepilogo per mese e categoria, solo per il referente
export const academy = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        const filters: StatisticheFilters = {};
        if (req.query.mese) filters.mese = String(req.query.mese);
        if (req.query.categoria) filters.categoria = String(req.query.categoria);
        if (req.query.dipendente) filters.dipendente = String(req.query.dipendente);

        const riepilogo = await statisticheSrv.academy(filters);
        res.json(riepilogo);
    } catch (err) {
        next(err);
    }
}
