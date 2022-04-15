import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../../types/authDto'
import { LoginDto } from 'types/loginDto';

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService)
    {
        this.authService = authService;
    }

    @HttpCode(200)
    @Post('signin')
    signin(@Body() dto: LoginDto)
    {
        return (this.authService.signin(dto));
    }

    @Post('signup')
    signup(@Body() dto: AuthDto)
    {
        return (this.authService.signup(dto));
    }

    @Post('google')
    google(@Body() dto: {token: string})
    {
        return (this.authService.google(dto));
    }
}
