import { Amount } from './amount.value-object';
import { AmountException } from '../exceptions/amount.exception';

describe('Amount Value Object', () => {
    describe('Valid amounts', () => {
        it('should create amount with minimum valid value (1000)', () => {
            const amount = new Amount(1000);
            expect(amount.getValue()).toBe(1000);
        });

        it('should create amount with maximum valid value (100000)', () => {
            const amount = new Amount(100000);
            expect(amount.getValue()).toBe(100000);
        });

        it('should create amount with value in valid range', () => {
            const amount = new Amount(50000);
            expect(amount.getValue()).toBe(50000);
        });
    });

    describe('Invalid amounts', () => {
        it('should throw error when amount is less than 1000', () => {
            expect(() => new Amount(999)).toThrow(AmountException);
            expect(() => new Amount(999)).toThrow('Amount must be between 1000 and 100000');
        });

        it('should throw error when amount is greater than 100000', () => {
            expect(() => new Amount(100001)).toThrow(AmountException);
            expect(() => new Amount(100001)).toThrow('Amount must be between 1000 and 100000');
        });

        it('should throw error when amount is zero', () => {
            expect(() => new Amount(0)).toThrow(AmountException);
        });

        it('should throw error when amount is negative', () => {
            expect(() => new Amount(-1000)).toThrow(AmountException);
        });
    });
});
