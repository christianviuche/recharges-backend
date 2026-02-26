import { IUserRepository } from "src/application/interfaces/user.repository.interface";
import { User } from "src/domain/entities/user.entity";

export class UserInMemoryRepository implements IUserRepository {
    
    private user: User[] = [
        new User('testuser', 'testuser', 'password123'),
    ];

    async getUserByUsername(username: string): Promise<User | null> {
        const user = this.user.find(u => u.username === username);
        return user || null;
    }
}