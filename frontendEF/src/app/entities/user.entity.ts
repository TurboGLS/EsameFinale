// ruoli applicativi previsti dalla traccia
export type Ruolo = 'DIPENDENTE' | 'REFERENTE';

export type User =  {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email?: string;
    ruolo: Ruolo;
    picture: string;
}
