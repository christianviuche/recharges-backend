import { PhoneNumber } from './phone-number.value-object';
import { PhoneNumberInvalidException } from '../exceptions/phone-number.exception';

describe('PhoneNumber Value Object', () => {
    describe('Valid phone numbers', () => {
        it('should create phone number starting with 3 and 10 digits', () => {
            const phoneNumber = new PhoneNumber('3001234567');
            expect(phoneNumber.getValue()).toBe('3001234567');
        });

        it('should create phone number with different valid formats', () => {
            const phoneNumber1 = new PhoneNumber('3101234567');
            const phoneNumber2 = new PhoneNumber('3201234567');
            const phoneNumber3 = new PhoneNumber('3501234567');

            expect(phoneNumber1.getValue()).toBe('3101234567');
            expect(phoneNumber2.getValue()).toBe('3201234567');
            expect(phoneNumber3.getValue()).toBe('3501234567');
        });
    });

    describe('Invalid phone numbers', () => {
        it('should throw error when phone number does not start with 3', () => {
            expect(() => new PhoneNumber('7634920645')).toThrow(PhoneNumberInvalidException);
            expect(() => new PhoneNumber('9875643319')).toThrow(PhoneNumberInvalidException);
            expect(() => new PhoneNumber('0432723789')).toThrow(PhoneNumberInvalidException);
        });

        it('should throw error when phone number has less than 10 digits', () => {
            expect(() => new PhoneNumber('32749326')).toThrow(PhoneNumberInvalidException);
            expect(() => new PhoneNumber('3725647')).toThrow(PhoneNumberInvalidException);
        });

        it('should throw error when phone number has more than 10 digits', () => {
            expect(() => new PhoneNumber('321836027378')).toThrow(PhoneNumberInvalidException);
            expect(() => new PhoneNumber('3894628918391')).toThrow(PhoneNumberInvalidException);
        });

        it('should throw error when phone number contains non-numeric characters', () => {
            expect(() => new PhoneNumber('32786t4722')).toThrow(PhoneNumberInvalidException);
            expect(() => new PhoneNumber('323-3232-123')).toThrow(PhoneNumberInvalidException);
            expect(() => new PhoneNumber('311 287 7139')).toThrow(PhoneNumberInvalidException);
        });

        it('should throw error when phone number is empty', () => {
            expect(() => new PhoneNumber('')).toThrow(PhoneNumberInvalidException);
        });
    });
});
