import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { tokenPairDto } from 'types/tokenPairDto';

@Controller('auth')
export class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService)
    {
        this.authService = authService;
    }

    @Post('login')
    intra(@Body() dto: {code: string})
    {
        console.log('Received code - POST /login');
        return (this.authService.login(dto));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Request() req: any)
    {
        const userId: number = req.user.sub;
        return (this.authService.logout(userId));
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Request() req: any): Promise<tokenPairDto>
    {
        const userId: number = req.user.sub;
        const userRefreshToken: string = req.user.refresh_token;
        return (this.authService.refreshTokens(userId, userRefreshToken));
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('checkToken')
    @HttpCode(HttpStatus.OK)
    checkToken()
    {
        return { statusCode: 200, };
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Get('checkRefreshToken')
    @HttpCode(HttpStatus.OK)
    checkRefreshToken()
    {
        return { statusCode: 200, };
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
