import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Referral } from './referral.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Referral])],
  controllers: [],
  providers: [UsersService],
})
export class ReferralsModule {}
