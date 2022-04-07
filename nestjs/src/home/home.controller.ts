import { Controller, Get, UseGuards } from '@nestjs/common';
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

    @Get()
    home (@GetUser() user: User)
    {
        console.log(user);
        return (JSON.stringify(user));
    }
}
