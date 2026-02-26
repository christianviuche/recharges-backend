import { IsNumber, IsString, IsNotEmpty, Min, Max, Matches } from 'class-validator';

export class BuyRechargeDto {
    @IsNumber()
    @Min(1000)
    @Max(100000)
    amount: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/^3\d{9}$/)
    phoneNumber: string;
}