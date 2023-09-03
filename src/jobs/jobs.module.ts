import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Referral } from 'src/entities';
import { Wallet } from 'src/wallets/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Referral, Wallet])],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {}
