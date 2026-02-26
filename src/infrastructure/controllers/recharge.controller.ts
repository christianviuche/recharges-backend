import { Body, Controller, Post, UseGuards, Request, Get } from "@nestjs/common";
import { BuyRechargeDto } from "../dtos/buy-recharge.dto";
import { BuyRechargeUseCase } from "src/application/use-cases/buy-recharge.use-case";
import { AuthGuard } from "@nestjs/passport";
import { GetRechargeHistoryUseCase } from "src/application/use-cases/get-recharge-history.use-case";

@Controller('recharges')
export class RechargeController {

    constructor(private buyRecargeUseCase: BuyRechargeUseCase, 
        private getRechargeHistoryUseCase: GetRechargeHistoryUseCase) {

    }

    @UseGuards(AuthGuard('jwt'))
    @Post('buy')
    async buyRecharge(@Body() buyRechargeDto: BuyRechargeDto, @Request() req) {
        const userId = req.user.userId;
        const recharge = await this.buyRecargeUseCase.execute(
            buyRechargeDto.amount, buyRechargeDto.phoneNumber, userId
        );

        return {
            id: recharge.id,
            phoneNumber: recharge.phoneNumber.getValue(),
            amount: recharge.amount.getValue(),
            userId: recharge.userId,
            createdAt: recharge.date
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('history')
    async getHistory(@Request() req) {
        const userId = req.user.userId;
        const history = await this.getRechargeHistoryUseCase.execute(userId);

        return history.map(recharge => ({
            id: recharge.id,
            phoneNumber: recharge.phoneNumber.getValue(),
            amount: recharge.amount.getValue(),
            userId: recharge.userId,
            createdAt: recharge.date
        }));
    }
}
