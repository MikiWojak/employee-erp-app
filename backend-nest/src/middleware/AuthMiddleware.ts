import {
    Injectable,
    NestMiddleware,
    UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(request, response, next: () => void) {
        if (!request.session || !request.session.user) {
            throw new UnauthorizedException();
        }

        return next();
    }
}
