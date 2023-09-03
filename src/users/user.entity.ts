import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Referral } from '../referrals/referral.entity';
import { Wallet } from '../wallets/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: null, nullable: true })
  referral_code: string;

  @Column({ default: null })
  referral_count: number;

  @OneToMany(() => Referral, (referral) => referral.referred_by)
  referrals: Referral[];

  @OneToMany(() => Wallet, (wallet) => wallet.user_id)
  wallets: Wallet[];
}
