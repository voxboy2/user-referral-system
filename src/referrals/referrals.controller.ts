import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post('generate')
  async generateReferralCode(@Body() body: { first_name: string }) {
    const referralCode = await this.referralsService.generate(body);
    return { referralCode };
  }

  @Post('match')
  async matchUserToReferrer(
    @Body() body: { referrer: number; user_id: number },
  ) {
    try {
      const success = await this.referralsService.matchUserToReferrer(
        body.referrer,
        body.user_id,
      );
      return { success };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('increment')
  async incrementReferralCount(@Body() body: { referrer: number; user_id: number }) {
    try {
      const success = await this.referralsService.incrementReferrer(
        body.referrer,
      );
      return { success };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('verify')
  async verifyReferralCode(@Body() body: { referral_code: string }) {
    try {
      const user_id = await this.referralsService.getReferralIdByCode(
        body.referral_code,
      );
      return { success: true, user_id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: 'Invalid referral code' };
      }
      return { success: false, message: 'An error occurred' };
    }
  }
}
