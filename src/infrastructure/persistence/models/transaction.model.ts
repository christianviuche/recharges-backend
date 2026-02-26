import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('transaction')
export class TransactionModel {
    @PrimaryColumn()
    id: string;

    @Column('numeric')
    amount: number;

    @Column()
    phoneNumber: string

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;
}