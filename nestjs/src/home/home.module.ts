import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [PrismaModule, JwtModule.register({})],
})
export class HomeModule {}
