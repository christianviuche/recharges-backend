import { Amount } from "../value-objects/amount.value-object";
import { PhoneNumber } from "../value-objects/phone-number.value-object";

export class Recharge {
    id: string;
    amount: Amount;
    phoneNumber: PhoneNumber;
    userId: string;
    date: Date;

    constructor(id: string, amount: Amount, phoneNumber: PhoneNumber, userId: string, date: Date) {
        this.id = id;
        this.amount = amount;
        this.phoneNumber = phoneNumber;
        this.userId = userId;
        this.date = date;
    }
}