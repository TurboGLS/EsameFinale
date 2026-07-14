import { Corso } from './corso.entity';
import { User } from './user.entity';

export type StatoAssegnazione = 'Assegnato' | 'Completato' | 'Scaduto' | 'Annullato';

export const STATI_ASSEGNAZIONE: StatoAssegnazione[] = ['Assegnato', 'Completato', 'Scaduto', 'Annullato'];

// assegnazione restituita
export type Assegnazione = {
    id: string;
    corso: Corso;
    dipendente: User;
    dataAssegnazione: string;
    dataScadenza: string;
    stato: StatoAssegnazione;
    dataCompletamento?: string;
}

// dati inviati in creazione o modifica
export type AssegnazionePayload = {
    corso: string;
    dipendente: string;
    dataAssegnazione?: string;
    dataScadenza: string;
}
