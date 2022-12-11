import { Module } from '@nestjs/common'
import { EventsController } from '@/events/events.controller'
import { EventsService } from '@/events/events.service'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
