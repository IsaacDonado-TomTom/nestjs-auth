import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  // Set the provides/service
  providers: [PrismaService],
  // Make sure we export this service to use it elsewhere in our application for database manipulation
  exports: [PrismaService],
})
export class PrismaModule {}
