import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsMongoId, IsInt, Min } from "class-validator";

export class AddCorsoDTO {
    @IsString()
    @IsNotEmpty()
    titolo: string;

    @IsOptional()
    @IsString()
    descrizione?: string;

    // la categoria è obbligatoria e deve riferire una categoria esistente
    @IsMongoId()
    categoria: string;

    // la durata prevista deve essere maggiore di zero
    @IsInt()
    @Min(1)
    durataOre: number;

    @IsOptional()
    @IsBoolean()
    obbligatorio?: boolean;

    @IsOptional()
    @IsBoolean()
    attivo?: boolean;
}

// in aggiornamento tutti i campi sono opzionali
export class UpdateCorsoDTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    titolo?: string;

    @IsOptional()
    @IsString()
    descrizione?: string;

    @IsOptional()
    @IsMongoId()
    categoria?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    durataOre?: number;

    @IsOptional()
    @IsBoolean()
    obbligatorio?: boolean;

    @IsOptional()
    @IsBoolean()
    attivo?: boolean;
}
