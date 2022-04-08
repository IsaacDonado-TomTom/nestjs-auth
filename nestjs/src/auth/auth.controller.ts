import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../../types/authDto'

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService)
    {
        this.authService = authService;
    }

    @Post('signin')
    signin(@Body() dto: AuthDto)
    {
        return (this.authService.signin(dto));
    }

    @Post('signup')
    signup(@Body() dto: AuthDto)
    {
        return (this.authService.signup(dto));
    }
}
