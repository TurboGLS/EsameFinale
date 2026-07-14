import { Corso } from "../corso/corso.entity";
import { User } from "../user/user.entity";

// stati possibili di una assegnazione che servono poi per l'enum
export type StatoAssegnazione = 'Assegnato' | 'Completato' | 'Scaduto' | 'Annullato';

export const STATI_ASSEGNAZIONE: StatoAssegnazione[] = ['Assegnato', 'Completato', 'Scaduto', 'Annullato'];

export type Assegnazione = {
    id?: string;
    corso: string | Corso;
    dipendente: string | User;
    dataAssegnazione: Date;
    dataScadenza: Date;
    stato: StatoAssegnazione;
    dataCompletamento?: Date;
}
