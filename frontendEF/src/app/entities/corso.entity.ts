import { Categoria } from './categoria.entity';

// corso restituito dall'API (categoria popolata)
export type Corso = {
    id: string;
    titolo: string;
    descrizione?: string;
    categoria: Categoria;
    durataOre: number;
    obbligatorio: boolean;
    attivo: boolean;
}

// dati inviati all'API in creazione/modifica (categoria come id)
export type CorsoPayload = {
    titolo: string;
    descrizione?: string;
    categoria: string;
    durataOre: number;
    obbligatorio: boolean;
    attivo: boolean;
}
