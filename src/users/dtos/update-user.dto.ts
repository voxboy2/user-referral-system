import {IsEmail, IsString, IsOptional } from 'class-validator'


export class UpdateUserDto {

    @IsString()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;
}