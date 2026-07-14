import { Categoria } from './categoria.entity';

export type Corso = {
    id: string;
    titolo: string;
    descrizione?: string;
    categoria: Categoria;
    durataOre: number;
    obbligatorio: boolean;
    attivo: boolean;
}

export type CorsoPayload = {
    titolo: string;
    descrizione?: string;
    categoria: string;
    durataOre: number;
    obbligatorio: boolean;
    attivo: boolean;
}
