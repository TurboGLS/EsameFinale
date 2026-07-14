import { IsString, IsNotEmpty } from "class-validator";

export class AddCategoriaDTO {
    @IsString()
    @IsNotEmpty()
    nomeCategoria: string;
}
