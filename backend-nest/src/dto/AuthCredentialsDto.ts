import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class AuthCredentialsDto {
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string;
}
