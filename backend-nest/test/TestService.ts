import { Test } from '@nestjs/testing';
import * as request from 'supertest-session';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/AppModule';
import { useSession } from '@/plugins/session';
import { useValidation } from '@/plugins/validation';
import { RolesService } from '@/services/RolesService';
import { UsersService } from '@/services/UsersService';
import { AuthCredentialsDto } from '@/dto/AuthCredentialsDto';

export class TestService {
    public app: INestApplication;
    public api;

    private rolesService: RolesService;
    private usersService: UsersService;

    async initTestingEnvironment() {
        const testModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        this.app = testModule.createNestApplication();

        this.rolesService = this.app.get<RolesService>(RolesService);
        this.usersService = this.app.get<UsersService>(UsersService);

        useSession(this.app);
        useValidation(this.app);

        await this.app.init();

        this.api = request(this.app.getHttpServer());
    }

    async truncateDatabase() {
        await this.usersService.truncate();
        await this.rolesService.truncate();
    }

    login(credentials: AuthCredentialsDto) {
        return this.api.post('/auth/login').send(credentials);
    }

    logout() {
        return this.api.post('/auth/logout');
    }

    async closeApp() {
        await this.app.close();
    }
}
