import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { UpdateUserDto } from '@/dto/UpdateUserDto';

export class StoreUserDto extends UpdateUserDto {
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string;
}
