import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { HomeService } from './home.service';

@UseGuards(AuthGuard('jwt'))
@Controller('home')
export class HomeController {

    constructor(private homeService: HomeService)
    {

    }

    @HttpCode(200)
    @Get()
    home (@Req() req: any)
    {
        return (this.homeService.homepage(req.user.sub));
    }
}
