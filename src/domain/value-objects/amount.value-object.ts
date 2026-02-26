import { AmountException } from "../exceptions/amount.exception";

export class Amount {
    private value: number;

    constructor(value: number) {
        this.validate(value);
        this.value = value;
    }

    private validate(value: number) {
        if (value < 1000 || value > 100000) {
            throw new AmountException('Amount must be between 1000 and 100000');
        }
    }

    public getValue(): number {
        return this.value;
    }
}