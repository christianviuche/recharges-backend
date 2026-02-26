import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from 'src/application/interfaces/token.service.interface';

@Injectable()
export class JwtTokenService implements ITokenService {
    constructor(private jwtService: JwtService) {}

    async sign(payload: { sub: string; username: string }): Promise<string> {
        return this.jwtService.signAsync(payload);
    }
}
