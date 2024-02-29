import {
    Column,
    Entity,
    OneToMany,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from 'typeorm';

import { User } from './User';

export enum UserRole {
    ADMIN = 'admin',
    EMPLOYEE = 'employee'
}

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;

    @OneToMany(() => User, user => user.role)
    users: User[];
}
