
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/users/user.entity";


@Entity()
export class Wallet {
   @PrimaryGeneratedColumn()
   id: number;
   
   @Column({ default: 0 })
   balance: number;

   @Column({ default: 'USD'})
   currency: string;

   @ManyToOne(() => User, user => user.wallets)
   @JoinColumn({ name: 'user_id' })
   user_id: User;

}