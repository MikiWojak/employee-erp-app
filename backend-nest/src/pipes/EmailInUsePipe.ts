import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    BadRequestException
} from '@nestjs/common';

import { UsersRepository } from '@/repositories/UsersRepository';

@Injectable()
export class EmailInUsePipe implements PipeTransform {
    constructor(private readonly usersRepository: UsersRepository) {}

    async transform(value: string, metadata: ArgumentMetadata) {
        // @TODO How to pass param id to make it work properly for both store and update?
        const user = await this.usersRepository.findByEmail(value);

        if (user) {
            throw new BadRequestException(['email is already in use']);
        }

        return value;
    }
}
