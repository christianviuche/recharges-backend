import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from './login.use-case';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { ITokenService } from '../interfaces/token.service.interface';
import { User } from '../../domain/entities/user.entity';

describe('LoginUseCase', () => {
    let useCase: LoginUseCase;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockTokenService: jest.Mocked<ITokenService>;

    beforeEach(() => {
        mockUserRepository = {
            getUserByUsername: jest.fn(),
        };

        mockTokenService = {
            sign: jest.fn(),
        };

        useCase = new LoginUseCase(mockUserRepository, mockTokenService);
    });

    describe('Successful login', () => {
        it('should return access token when credentials are valid', async () => {
            const user = new User('user123', 'testuser', 'password123');
            const expectedToken = 'jwt-token-123';

            mockUserRepository.getUserByUsername.mockResolvedValue(user);
            mockTokenService.sign.mockResolvedValue(expectedToken);

            const result = await useCase.execute('testuser', 'password123');

            expect(result).toEqual({ access_token: expectedToken });
            expect(mockUserRepository.getUserByUsername).toHaveBeenCalledWith('testuser');
            expect(mockTokenService.sign).toHaveBeenCalledWith({
                sub: 'user123',
                username: 'testuser',
            });
        });

        it('should call token service with correct payload', async () => {
            const user = new User('user456', 'john', 'pass456');
            mockUserRepository.getUserByUsername.mockResolvedValue(user);
            mockTokenService.sign.mockResolvedValue('token');

            await useCase.execute('john', 'pass456');

            expect(mockTokenService.sign).toHaveBeenCalledWith({
                sub: 'user456',
                username: 'john',
            });
        });
    });

    describe('Failed login', () => {
        it('should throw UnauthorizedException when user does not exist', async () => {
            mockUserRepository.getUserByUsername.mockResolvedValue(null);

            await expect(
                useCase.execute('nonexistent', 'password')
            ).rejects.toThrow(UnauthorizedException);

            await expect(
                useCase.execute('nonexistent', 'password')
            ).rejects.toThrow('Invalid credentials');
        });

        it('should throw UnauthorizedException when password is incorrect', async () => {
            const user = new User('user123', 'testuser', 'correctpassword');
            mockUserRepository.getUserByUsername.mockResolvedValue(user);

            await expect(
                useCase.execute('testuser', 'wrongpassword')
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should not call token service when credentials are invalid', async () => {
            mockUserRepository.getUserByUsername.mockResolvedValue(null);

            try {
                await useCase.execute('invalid', 'invalid');
            } catch (error) {
            }

            expect(mockTokenService.sign).not.toHaveBeenCalled();
        });

        it('should not call token service when password is wrong', async () => {
            const user = new User('user123', 'testuser', 'correctpassword');
            mockUserRepository.getUserByUsername.mockResolvedValue(user);

            try {
                await useCase.execute('testuser', 'wrongpassword');
            } catch (error) {
            }

            expect(mockTokenService.sign).not.toHaveBeenCalled();
        });
    });
});
