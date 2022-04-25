import { Injectable, ForbiddenException, ImATeapotException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HomeDto } from 'types/homeDto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class HomeService {

    constructor(private prisma: PrismaService, private jwt: JwtService){}
    
    async homepage(id: number)
    {
        try
        {
            const user: any = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });

            if (!user)
            {
                return ({
                    notFound: true,
                });
            }
            else
            {
                if (user.userReady === false)
                {
                    throw new ImATeapotException();
                }
                // Return relevant data to user for homepage
                return ({
                    email: user.email,
                    nickname: user.nickname,
                    defaultPic: user.defaultPic,
                    notFound: false,
                });
            }
        }
        catch(error)
        {
            throw error;
        }
    }
}
