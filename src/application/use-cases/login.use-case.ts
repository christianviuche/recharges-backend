import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { ITokenService } from '../interfaces/token.service.interface';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('IUserRepository') private userRepository: IUserRepository,
        @Inject('ITokenService') private tokenService: ITokenService
    ) {}

    async execute(username: string, password: string): Promise<{ access_token: string }> {
        const user = await this.userRepository.getUserByUsername(username);

        if (!user || user.password !== password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username };

        return {
            access_token: await this.tokenService.sign(payload),
        };
    }
}