import {
    Body,
    Post,
    Session,
    Response,
    Controller,
    HttpStatus
} from '@nestjs/common';

import { User } from '@/entities/User';
import { LoginHandler } from '@/services/Auth/LoginHandler';
import { AuthCredentialsDto } from '@/dto/AuthCredentialsDto';

@Controller('auth')
export class LoginController {
    constructor(private readonly loginHandler: LoginHandler) {}

    @Post('login')
    async invoke(
        @Session() session: Record<string, User>,
        @Body() authCredentialsDto: AuthCredentialsDto,
        @Response() response
    ) {
        const user = await this.loginHandler.handle(authCredentialsDto);

        session.user = user;

        response.status(HttpStatus.OK).send(user);
    }
}
