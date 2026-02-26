import { Body, Controller, Post } from "@nestjs/common";
import { LoginUseCase } from "src/application/use-cases/login.use-case";
import { LoginDto } from "../dtos/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private loginUseCase: LoginUseCase) {
        
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.loginUseCase.execute(loginDto.username, loginDto.password);
    }

}