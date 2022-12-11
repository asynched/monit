import { Module } from '@nestjs/common'
import { EventsModule } from '@/events/events.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { HealthModule } from '@/health/health.module'
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [EventsModule, PrismaModule, HealthModule, StatisticsModule],
})
export class AppModule {}
