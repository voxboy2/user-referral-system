import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Referral } from './referral.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(User) private user: Repository<User>,
    @InjectRepository(Referral) private referral: Repository<Referral>,
  ) {}

  create(
    referred_by: User,
    user_id: number,
    claimed_bonuses: [],
    paid: boolean,
  ) {
    const referral = this.referral.create({
      referred_by,
      user_id,
      claimed_bonuses,
      paid,
    });
    return this.referral.save(referral);
  }

  async generate(data: { first_name: string }) {
    const first = data.first_name.slice(0, 3);
    const random = Math.random().toString(36).substr(2, 3);
    return `${first}${random}`.toUpperCase();
  }

  async getReferralIdByCode(referral_code: string) {
    const referrer = await this.user.findOne({
      where: {
        referral_code: referral_code,
      },
    });

    if (!referrer) {
      throw new NotFoundException('invalid referral code');
    }

    const { id } = referrer;
    return id;
  }

  async matchUserToReferrer(User, user_id: number) {
    const saveReferral = await this.referral.create({
      referred_by: User,
      user_id: user_id,
    });

    await this.referral.save(saveReferral);

    if (!saveReferral) throw Error('Unable to save referral for this user');
    return true;
  }

  async incrementReferrer(user_id: number) {
    const referredBy = await this.user.findOne({
      where: { id: user_id},
    });

    if (!referredBy) {
      return false;
    }

    referredBy.referral_count += 1;
    await this.user.save(referredBy);

    if (!referredBy) throw Error('Unable to increment referral count');
    return true;
  }
}
