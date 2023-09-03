import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ReferralsService } from 'src/referrals/referrals.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User) private user: Repository<User>,
    private referralService: ReferralsService,
    private walletsService: WalletsService,
  ) {}

  async signup(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    referral_code: string,
  ) {
    // See if email is in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    let referrer;
   

    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // create a new user
    const user = await this.usersService.create(
      first_name,
      last_name,
      referral_code,
      email,
      result,
    );


    if (!user) {
      throw new BadRequestException("Unable to save user's data");
    }

     
    if (referral_code) {
      referrer = await this.referralService.getReferralIdByCode(referral_code);
    }

    if (referrer) {
      await this.referralService.matchUserToReferrer(referrer, user.id);
      await this.referralService.incrementReferrer(referrer);
    }

    if (user) {
      const updatedReferralCode = await this.referralService.generate({
        first_name,
      });

      console.log(updatedReferralCode);

      user.referral_code = updatedReferralCode;
      await this.user.save(user);
    }


    let wallets;
    if (!wallets) {
      await this.walletsService.create(wallets, user.id)
    }

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
