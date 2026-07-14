import { IsMongoId, IsOptional, IsDateString } from "class-validator";

export class AddAssegnazioneDTO {
    // un'assegnazione deve essere associata a un corso e a un dipendente
    @IsMongoId()
    corso: string;

    @IsMongoId()
    dipendente: string;

    // se non fornita, il service imposta la data odierna
    @IsOptional()
    @IsDateString()
    dataAssegnazione?: string;

    @IsDateString()
    dataScadenza: string;
}

// aggiornamento parziale di un'assegnazione solo per il referente
export class UpdateAssegnazioneDTO {
    @IsOptional()
    @IsMongoId()
    corso?: string;

    @IsOptional()
    @IsMongoId()
    dipendente?: string;

    @IsOptional()
    @IsDateString()
    dataScadenza?: string;
}
