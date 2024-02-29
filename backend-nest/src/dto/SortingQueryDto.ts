import { IsArray, IsOptional } from 'class-validator';

import type { Order } from '@/types/Params';

export class SortingQueryDto {
    @IsOptional()
    @IsArray()
    sortBy: string[];

    order: Order;
}
