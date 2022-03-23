import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { authModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  // Importing authModule and PrismaModule into the main app, so anything these modules export we're allowed to use directly.
  imports: [authModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
