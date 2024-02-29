import {
    Length,
    IsEmail,
    IsString,
    IsNotEmpty,
    IsDateString
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateUserDto {
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @IsString()
    @Length(2, 64)
    readonly firstName: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @IsString()
    @Length(2, 64)
    readonly lastName: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @IsDateString()
    readonly dateOfBirth: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;
}
