import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';

export enum PaymentType {
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_MADE = 'payment_made',
  PAYMENT_WITHDRAW = 'payment_withdraw',
  PAYMENT_FILL = 'payment_fill',
}

@Entity()
export class Transaction {
  constructor() {
    this.date = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['payment_received', 'payment_made', 'payment_withdraw', 'payment_fill'],
  })
  type: PaymentType;

  @Column({ type: 'decimal' })
  value: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, { cascade: true })
  user: User;
}
