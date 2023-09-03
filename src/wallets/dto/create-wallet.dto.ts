import { IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  balance: number;

  @IsString()
  currency: string;
}