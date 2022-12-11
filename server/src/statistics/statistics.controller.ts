import { Controller, Get } from '@nestjs/common'
import { StatisticsService } from '@/statistics/statistics.service'

@Controller('/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/error')
  async getErrorStatistics() {
    return this.statisticsService.getErrorStatistics()
  }

  @Get('/fetch')
  async getFetchStatistics() {
    return this.statisticsService.getFetchStatistics()
  }
}
