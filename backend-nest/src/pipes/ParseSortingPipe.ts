import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

import { SortingQueryDto } from '@/dto/SortingQueryDto';

import type { Order } from '@/types/Params';

@Injectable()
export class ParseSortingPipe implements PipeTransform {
    transform(
        value: SortingQueryDto,
        metadata: ArgumentMetadata
    ): SortingQueryDto {
        const { sortBy = ['createdAt:DESC'] } = value;

        const orderItems: Order = {};

        sortBy.forEach(orderItem => {
            const [key, order] = orderItem.split(':');

            orderItems[key] = order;
        });

        const options = {
            sortBy,
            order: orderItems
        };

        return options;
    }
}
