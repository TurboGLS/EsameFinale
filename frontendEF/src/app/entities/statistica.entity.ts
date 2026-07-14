// riga del riepilogo statistiche (aggregata per mese e categoria)
export type Statistica = {
    mese: string;
    categoria: string;
    numeroAssegnazioni: number;
    numeroCompletamenti: number;
    percentualeCompletamento: number;
}
