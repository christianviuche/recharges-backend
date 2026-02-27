import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Request,
    UseGuards,
    Logger,
} from "@nestjs/common";
import { BuyRechargeDto } from "../dtos/buy-recharge.dto";
import { BuyRechargeUseCase } from "src/application/use-cases/buy-recharge.use-case";
import { AuthGuard } from "@nestjs/passport";
import { GetRechargeHistoryUseCase } from "src/application/use-cases/get-recharge-history.use-case";
import { AmountException } from "src/domain/exceptions/amount.exception";
import { PhoneNumberInvalidException } from "src/domain/exceptions/phone-number.exception";

@Controller('recharges')
export class RechargeController {

    constructor(private buyRecargeUseCase: BuyRechargeUseCase, 
        private getRechargeHistoryUseCase: GetRechargeHistoryUseCase) {

    }

    private readonly logger = new Logger(RechargeController.name);

    @UseGuards(AuthGuard('jwt'))
    @Post('buy')
    async buyRecharge(@Body() buyRechargeDto: BuyRechargeDto, @Request() req) {
        try {
            const userId = req.user.userId;
            this.logger.log(`Buy recharge request userId=${userId} amount=${buyRechargeDto.amount}`);
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
        } catch (error) {
            const userId = req?.user?.userId ?? 'unknown';
            this.logger.error(`Buy recharge failed userId=${userId}`);
            if (error instanceof AmountException || error instanceof PhoneNumberInvalidException) {
                throw new BadRequestException(error.message);
            }

            throw new InternalServerErrorException('Error processing recharge');
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('history')
    async getHistory(@Request() req) {
        try {
            const userId = req.user.userId;
            this.logger.log(`Get history request userId=${userId}`);
            const history = await this.getRechargeHistoryUseCase.execute(userId);

            return history.map(recharge => ({
                id: recharge.id,
                phoneNumber: recharge.phoneNumber.getValue(),
                amount: recharge.amount.getValue(),
                userId: recharge.userId,
                createdAt: recharge.date
            }));
        } catch (error) {
            const userId = req?.user?.userId ?? 'unknown';
            this.logger.error(`Get history failed userId=${userId}`);
            throw new InternalServerErrorException('Error fetching recharge history');
        }
    }
}
