import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersRepository } from '@/repositories/UsersRepository';

@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async findLoggedUser(id: string) {
        const user = await this.usersRepository.getById(id);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
