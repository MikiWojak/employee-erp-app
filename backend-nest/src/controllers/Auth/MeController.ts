import { Get, Session, Controller } from '@nestjs/common';

import { User } from '@/entities/User';
import { AuthService } from '@/services/AuthService';

@Controller('auth')
export class MeController {
    constructor(private readonly authService: AuthService) {}

    @Get('me')
    async invoke(@Session() session: Record<string, User>) {
        return this.authService.findLoggedUser(session.user.id);
    }
}
