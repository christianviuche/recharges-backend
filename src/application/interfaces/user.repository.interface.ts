import { User } from "src/domain/entities/user.entity";

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
    getUserByUsername(username: string): Promise<User | null>;
}