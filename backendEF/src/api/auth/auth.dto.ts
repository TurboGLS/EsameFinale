import { IsEmail, IsString, IsStrongPassword, IsUrl, Matches } from "class-validator";

export class AddUserDTO {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    username: string;

    @IsString()
    @IsStrongPassword()
    password: string;
}