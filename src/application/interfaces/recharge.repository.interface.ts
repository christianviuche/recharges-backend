import { Recharge } from "src/domain/entities/recharge.entity";

export const IRechargeRepository = Symbol('IRechargeRepository');

export interface IRechargeRepository {
    save(recharge: Recharge): Promise<void>;
    getRechargesByUser(userId: string): Promise<Recharge[]>;
}