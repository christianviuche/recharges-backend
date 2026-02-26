import { BuyRechargeUseCase } from './buy-recharge.use-case';
import { IRechargeRepository } from '../interfaces/recharge.repository.interface';
import { AmountException } from '../../domain/exceptions/amount.exception';
import { PhoneNumberInvalidException } from '../../domain/exceptions/phone-number.exception';

describe('BuyRechargeUseCase', () => {
    let useCase: BuyRechargeUseCase;
    let mockRechargeRepository: jest.Mocked<IRechargeRepository>;

    beforeEach(() => {
        mockRechargeRepository = {
            save: jest.fn().mockResolvedValue(undefined),
            getRechargesByUser: jest.fn(),
        };

        useCase = new BuyRechargeUseCase(mockRechargeRepository);
    });

    describe('Valid recharge', () => {
        it('should create a recharge with valid data', async () => {
            const amount = 50000;
            const phoneNumber = '3261736212';
            const userId = 'user123';

            const recharge = await useCase.execute(amount, phoneNumber, userId);

            expect(recharge).toBeDefined();
            expect(recharge.id).toBeDefined();
            expect(recharge.amount.getValue()).toBe(amount);
            expect(recharge.phoneNumber.getValue()).toBe(phoneNumber);
            expect(recharge.userId).toBe(userId);
            expect(recharge.date).toBeInstanceOf(Date);
        });

        it('should call repository save method', async () => {
            const amount = 50000;
            const phoneNumber = '3261736212';
            const userId = 'user123';

            await useCase.execute(amount, phoneNumber, userId);

            expect(mockRechargeRepository.save).toHaveBeenCalledTimes(1);
            expect(mockRechargeRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: userId,
                })
            );
        });

        it('should create recharge with minimum valid amount', async () => {
            const recharge = await useCase.execute(1000, '3261736212', 'user123');
            expect(recharge.amount.getValue()).toBe(1000);
        });

        it('should create recharge with maximum valid amount', async () => {
            const recharge = await useCase.execute(100000, '3261736212', 'user123');
            expect(recharge.amount.getValue()).toBe(100000);
        });
    });

    describe('Invalid amount', () => {
        it('should throw error when amount is less than 1000', async () => {
            await expect(
                useCase.execute(999, '3261736212', 'user123')
            ).rejects.toThrow(AmountException);
        });

        it('should throw error when amount is greater than 100000', async () => {
            await expect(
                useCase.execute(100001, '3261736212', 'user123')
            ).rejects.toThrow(AmountException);
        });

        it('should not call repository when amount is invalid', async () => {
            try {
                await useCase.execute(500, '3261736212', 'user123');
            } catch (error) {
            }
            expect(mockRechargeRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('Invalid phone number', () => {
        it('should throw error when phone number does not start with 3', async () => {
            await expect(
                useCase.execute(50000, '2001234567', 'user123')
            ).rejects.toThrow(PhoneNumberInvalidException);
        });

        it('should throw error when phone number has invalid length', async () => {
            await expect(
                useCase.execute(50000, '326173621', 'user123')
            ).rejects.toThrow(PhoneNumberInvalidException);
        });

        it('should throw error when phone number contains non-numeric characters', async () => {
            await expect(
                useCase.execute(50000, '326173621a', 'user123')
            ).rejects.toThrow(PhoneNumberInvalidException);
        });

        it('should not call repository when phone number is invalid', async () => {
            try {
                await useCase.execute(50000, '1234567890', 'user123');
            } catch (error) {
            }
            expect(mockRechargeRepository.save).not.toHaveBeenCalled();
        });
    });
});
