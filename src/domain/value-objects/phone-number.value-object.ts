import { PhoneNumberInvalidException } from "../exceptions/phone-number.exception";

export class PhoneNumber {
    private readonly value: string;

    constructor(value: string) {
        this.validate(value);
        this.value = value;
    }

    private validate(value: string): void {
        const pattern = /^3\d{9}$/;

        if (!pattern.test(value)) {
            throw new PhoneNumberInvalidException(
                'Phone number must start with "3", be 10 characters long, and contain only numeric characters',
            );
        }
    }

    public getValue(): string {
        return this.value;
    }
}

