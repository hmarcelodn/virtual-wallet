import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ExchangeRate {
  constructor() {
    this.date = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quote: string;

  @Column({ type: 'decimal' })
  rate: number;

  @Column()
  date: Date;
}
