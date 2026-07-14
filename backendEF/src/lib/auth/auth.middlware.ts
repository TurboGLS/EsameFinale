import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { Ruolo } from "../../api/user/user.entity";

// verifica che la richiesta abbia un JWT valido
export const isAuthenticated = passport.authenticate('jwt', { session: false });

// verifica che l'utente autenticato abbia uno dei ruoli giusti
export const hasRole = (...ruoli: Ruolo[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user || !ruoli.includes(user.ruolo)) {
            res.status(403).json({
                error: 'ForbiddenError',
                message: 'Operazione non consentita per il tuo ruolo'
            });
            return;
        }
        next();
    };
};
