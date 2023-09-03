import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Referral, User } from 'src/entities';
import { ReferralsModule } from 'src/referrals/referrals.module';
import { Wallet } from 'src/wallets/wallet.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindOptionsWhere , MoreThanOrEqual} from 'typeorm';

export enum BonusTypes {
  referredUsers = 'referred-users',
}
const BonusRules = {
  [BonusTypes.referredUsers]: { number: 5, bonusValue: 3 },
};

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(User) private user: Repository<User>,
    @InjectRepository(Wallet) private wallet: Repository<Wallet>,
    @InjectRepository(Referral) private referral: Repository<Referral>,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async findQualifiedUsers() {
    try {
      const qualifiedUsers = await this.user.find({
        where: { referral_count: MoreThanOrEqual(5) },
      });

      console.log('cron is running 1', qualifiedUsers);

      for (const user of qualifiedUsers) {
        const referral = await this.referral.findOne({
          where: {
            referred_by: user?.id as FindOptionsWhere<User>,
            paid: false,
            processing: false,
          },
        });

        console.log('cron is running 3', referral);

        if (referral) {
          // Mark the referral as processing
          referral.processing = true;
          await this.referral.save(referral);
        }
      }
    } catch (error) {
      console.error('Error finding users with enough referrals:', error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE) // Cron job to pay eligible users
  async payQualifiedUsers() {
    try {
      const referralsToPay = await this.referral.find({
        where: {
          processing: true,
        },
      });

      for (const referral of referralsToPay) {
        // Calculate the bonus amount
        const rule = BonusRules[BonusTypes.referredUsers];
        const bonusAmount = rule.bonusValue;

        const wallet = await this.wallet.findOne({
          where: { user_id: referral.user_id as FindOptionsWhere<User> },
        });

        console.log('cron is running 2', wallet);

        if (wallet) {
          wallet.balance += bonusAmount;
          await this.wallet.save(wallet);
        }

        // Mark the referral as paid
        referral.claimed_bonuses?.push(BonusTypes.referredUsers);
        referral.paid = true;
        referral.processing = false;
        await this.referral.save(referral);

        console.log(`Credited user: ${referral.user_id} with $${bonusAmount}`);
      }
    } catch (error) {
      console.error('Error paying eligible users:', error);
    }
  }
}
