import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

import { PaginationQueryDto } from '@/dto/PaginationQueryDto';

@Injectable()
export class ParsePaginationPipe implements PipeTransform {
    transform(
        value: PaginationQueryDto,
        metadata: ArgumentMetadata
    ): PaginationQueryDto {
        const { page = 1, perPage = 10 } = value;

        const skip = (page - 1) * perPage;
        const take = perPage;

        const options = {
            ...value,
            skip,
            take
        };

        return options;
    }
}
