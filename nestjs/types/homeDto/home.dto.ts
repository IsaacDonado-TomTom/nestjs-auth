import { IsBoolean, IsDecimal, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class HomeDto
{
    sub: number | null;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    nickname: string;

}