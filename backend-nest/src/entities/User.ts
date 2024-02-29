import {
    Column,
    Entity,
    ManyToOne,
    BeforeInsert,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';
import { hash } from 'bcrypt';

import { Role } from './Role';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column('date')
    dateOfBirth: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ default: 0 })
    vacationDaysSum: number;

    @Column({ default: 0 })
    vacationDaysUsed: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;

    @ManyToOne(() => Role, role => role.users)
    role: Role;

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}
