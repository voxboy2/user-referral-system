import { Column, PrimaryGeneratedColumn, ManyToOne, Entity, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Referral {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.referrals)
  @JoinColumn({ name: 'referred_by' })
  referred_by: User

  @Column({ nullable: true })
  user_id: number;

  @Column('simple-json', {default: null})
  claimed_bonuses: string[];

  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @Column({ type: 'boolean', default: false })
  processing: boolean;


}
