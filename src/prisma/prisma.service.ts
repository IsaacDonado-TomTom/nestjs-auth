import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor()
    {
        super({
            datasources: {
                db: {
                    url: 'postgresql://user123:pass123@172.20.0.2:5432/nestdb?schema=public'
                },
            },
        });
    }
}
