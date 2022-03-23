import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [authModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
