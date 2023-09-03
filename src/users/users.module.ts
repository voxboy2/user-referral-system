import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { Referral } from '../referrals/referral.entity'
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';
import { ReferralsService } from '../referrals/referrals.service';
import { ReferralsModule } from '../referrals/referrals.module';
import { WalletsService } from 'src/wallets/wallets.service';
import { Wallet } from 'src/wallets/wallet.entity';

@Module({
  imports: [ReferralsModule, TypeOrmModule.forFeature([User, Referral, Wallet])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    ReferralsService,
    WalletsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {}
