import {
    Body,
    Controller,
    HttpException,
    InternalServerErrorException,
    Logger,
    Post
} from "@nestjs/common";
import { LoginUseCase } from "src/application/use-cases/login.use-case";
import { LoginDto } from "../dtos/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private loginUseCase: LoginUseCase) {
        
    }

    private readonly logger = new Logger(AuthController.name);

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            this.logger.log(`Login request for user: ${loginDto.username}`);
            return await this.loginUseCase.execute(loginDto.username, loginDto.password);
        } catch (error) {
            this.logger.error(`Login failed for user: ${loginDto.username}`);
            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException('Error during login');
        }
    }

}