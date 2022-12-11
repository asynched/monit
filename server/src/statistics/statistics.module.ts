import { Module } from '@nestjs/common'
import { PrismaModule } from '@/prisma/prisma.module'
import { StatisticsController } from '@/statistics/statistics.controller'
import { StatisticsService } from '@/statistics/statistics.service'

@Module({
  imports: [PrismaModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
