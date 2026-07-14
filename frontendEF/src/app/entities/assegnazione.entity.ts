import { Corso } from './corso.entity';
import { User } from './user.entity';

// stati possibili di una assegnazione
export type StatoAssegnazione = 'Assegnato' | 'Completato' | 'Scaduto' | 'Annullato';

export const STATI_ASSEGNAZIONE: StatoAssegnazione[] = ['Assegnato', 'Completato', 'Scaduto', 'Annullato'];

// assegnazione restituita dall'API (corso e dipendente popolati)
export type Assegnazione = {
    id: string;
    corso: Corso;
    dipendente: User;
    dataAssegnazione: string;
    dataScadenza: string;
    stato: StatoAssegnazione;
    dataCompletamento?: string;
}

// dati inviati all'API in creazione/modifica (corso e dipendente come id)
export type AssegnazionePayload = {
    corso: string;
    dipendente: string;
    dataAssegnazione?: string;
    dataScadenza: string;
}
