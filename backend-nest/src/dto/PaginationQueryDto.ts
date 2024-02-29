import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    page: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    perPage: number;

    @IsOptional()
    @IsBoolean()
    // @DEPRECATED Delete in the future
    fetchAll: boolean;

    skip: number;
    take: number;
}
