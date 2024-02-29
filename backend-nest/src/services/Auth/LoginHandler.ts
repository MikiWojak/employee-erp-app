import { compare } from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthCredentialsDto } from '@/dto/AuthCredentialsDto';
import { UsersRepository } from '@/repositories/UsersRepository';

@Injectable()
export class LoginHandler {
    constructor(private readonly usersRepository: UsersRepository) {}

    async handle(authCredentialsDto: AuthCredentialsDto) {
        const { email, password } = authCredentialsDto;

        const user = await this.usersRepository.findByEmail(email, {
            select: ['email', 'password']
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        const passwordValid = await compare(password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException();
        }

        return this.usersRepository.findByEmail(email, {
            relations: {
                role: true
            }
        });
    }
}
