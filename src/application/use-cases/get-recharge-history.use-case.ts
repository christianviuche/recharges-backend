import { Inject } from "@nestjs/common";
import { IRechargeRepository } from "../interfaces/recharge.repository.interface";

export class GetRechargeHistoryUseCase {
    constructor(@Inject('IRechargeRepository') private rechargeRepository: IRechargeRepository) {

    }

    async execute(userId: string) {
        return await this.rechargeRepository.getRechargesByUser(userId);
    }
}