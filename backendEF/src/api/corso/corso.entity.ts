import { Categoria } from "../categoria/categoria.entity";

export type Corso = {
    id?: string;
    titolo: string;
    descrizione?: string;
    categoria: string | Categoria;
    durataOre: number;
    obbligatorio: boolean;
    attivo: boolean;
}
