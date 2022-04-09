import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class HomeDto
{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    nickname: string;

    @IsBoolean()
    notfound: boolean;
}