import { Request, Response, NextFunction } from "express";
import userSrv from "./user.service";

export const me = async (
    req: Request,
    res: Response,
    next: NextFunction) => {

        res.json(req.user);
    }

// elenco dipendenti solo per i referenti
export const getDipendenti = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
        try {
            const dipendenti = await userSrv.getDipendenti();
            res.json(dipendenti);
        } catch (err) {
            next(err);
        }
    }
