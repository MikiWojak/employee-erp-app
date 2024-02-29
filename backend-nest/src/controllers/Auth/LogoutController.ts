import {
    Post,
    Session,
    Response,
    Controller,
    HttpStatus
} from '@nestjs/common';

@Controller('auth')
export class LogoutController {
    @Post('logout')
    invoke(@Session() session, @Response() response) {
        session.destroy(err => {});

        response.status(HttpStatus.NO_CONTENT).send();
    }
}
