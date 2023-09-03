import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReferralsModule } from './referrals/referrals.module';
import { User , Referral } from './entities/index'
import { Wallet } from './wallets/wallet.entity';
import { WalletsModule } from './wallets/wallets.module';
import { JobsModule } from './jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          database: 'bank_app',
          port: 8889,
          username: 'root',
          password: 'root',
          host: 'localhost',
          synchronize: true,
          entities: [User, Referral, Wallet],
        };
      },
    }),
    ScheduleModule.forRoot(),


    UsersModule,
    ReferralsModule,
    WalletsModule,
    JobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
