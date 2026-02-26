import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Recharge } from '../../domain/entities/recharge.entity';
import { Amount } from '../../domain/value-objects/amount.value-object';
import { PhoneNumber } from '../../domain/value-objects/phone-number.value-object';
import { IRechargeRepository } from '../interfaces/recharge.repository.interface';

@Injectable()
export class BuyRechargeUseCase {
    constructor(@Inject('IRechargeRepository') private rechargeRepository: IRechargeRepository) {}

    async execute(amount: number, phoneNumber: string, userId: string): Promise<Recharge> {
        const amountValueObject = new Amount(amount);
        const phoneNumberValueObject = new PhoneNumber(phoneNumber);

        const id = randomUUID();
        const recharge = new Recharge(id, amountValueObject, phoneNumberValueObject, userId, new Date());

        await this.rechargeRepository.save(recharge);

        return recharge;
    }
}