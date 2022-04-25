import { Body, Controller, Get, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../../types/authDto'
import { LoginDto } from 'types/loginDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService)
    {
        this.authService = authService;
    }

    @Post('intra')
    intra(@Body() dto: {code: string})
    {
        return (this.authService.intra(dto));
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('intra/setnick')
    setnick(@Body() dto: any, @Req() req: any)
    {
        console.log('dto received in controller, sending this and email to service.');
        console.log(dto);
        return (this.authService.setNick(dto, req.user.email));
    }

}
