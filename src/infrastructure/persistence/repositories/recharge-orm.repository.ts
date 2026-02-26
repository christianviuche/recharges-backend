import { IRechargeRepository } from "src/application/interfaces/recharge.repository.interface";
import { TransactionModel } from "../models/transaction.model";
import { Recharge } from "src/domain/entities/recharge.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Amount } from "src/domain/value-objects/amount.value-object";
import { PhoneNumber } from "src/domain/value-objects/phone-number.value-object";

@Injectable()
export class RechargeOrmRepository implements IRechargeRepository {

    constructor(@InjectRepository(TransactionModel) private dbRepository: Repository<TransactionModel>) {

    }

    async save(recharge: Recharge): Promise<void> {
        const newTransaction = this.dbRepository.create({
            id: recharge.id,
            amount: recharge.amount.getValue(),
            phoneNumber: recharge.phoneNumber.getValue(),
            userId: recharge.userId,
            createdAt: recharge.date
        });

        await this.dbRepository.save(newTransaction);
    }

    async getRechargesByUser(userId: string): Promise<Recharge[]> {
        const transactions = await this.dbRepository.find({
            where: { userId: userId },
        });

        return transactions.map(transaction => new Recharge(
            transaction.id,
            new Amount(transaction.amount),
            new PhoneNumber(transaction.phoneNumber),
            transaction.userId,
            transaction.createdAt
        ));
    }
}