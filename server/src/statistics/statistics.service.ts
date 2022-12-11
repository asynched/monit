import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFetchStatistics() {
    const [
      averageFetchTime,
      mostExpensiveFetchCalls,
      mostCalledFetchUrls,
      averageFetchTimePerUrl,
    ] = await Promise.all([
      this.getAverageFetchTime(),
      this.getMostExpensiveFetchCalls(),
      this.getMostCalledFetchUrls(),
      this.getAverageFetchTimePerUrl(),
    ])

    return {
      average: averageFetchTime,
      mostExpensiveFetchCalls,
      mostCalledFetchUrls,
      averageFetchTimePerUrl,
    }
  }

  private async getAverageFetchTime() {
    const average = await this.prismaService.fetchEvent.aggregate({
      _avg: {
        time: true,
      },
    })

    return average._avg.time
  }

  private async getMostCalledFetchUrls() {
    return (await this.prismaService.$queryRaw`
      SELECT
        AVG(f.time) AS average,
        f.url,
        f.method
      FROM
        fetch_events f
      GROUP BY
        f.url,
        f.method
      ORDER BY
        average DESC
      LIMIT
        10;
    `) as Array<{ average: number; url: string; method: string }>
  }

  private async getAverageFetchTimePerUrl() {
    return (await this.prismaService.$queryRaw`
      SELECT
        AVG(f.time) AS average,
        f.url,
        f.method
      FROM
        fetch_events f
      GROUP BY
        f.url,
        f.method
      ORDER BY
        average DESC
      LIMIT
        10;
    `) as Array<{ average: number; url: string; method: string }>
  }

  private async getMostExpensiveFetchCalls() {
    return (await this.prismaService.$queryRaw`
      SELECT
        f.time,
        f.url,
        f.method
      FROM
        fetch_events f
      ORDER BY
        f.time DESC
      LIMIT
        10;
    `) as Array<{ time: number; url: string; method: string }>
  }

  async getErrorStatistics() {
    const [total, errorsByDeviceName, errorsByDeviceType, errorsByFilename] =
      await Promise.all([
        this.prismaService.errorEvent.count(),
        this.getErrorsByDeviceName(),
        this.getErrorsByDeviceType(),
        this.getErrorsByFilename(),
      ])

    return {
      total,
      errorsByDeviceName,
      errorsByDeviceType,
      errorsByFilename,
    }
  }

  private async getErrorsByDeviceName() {
    return (await this.prismaService.$queryRaw`
      SELECT
        COUNT(e.id) AS errors,
        d.name
      FROM
        error_events e
        INNER JOIN devices d ON e.device_id = d.id
      GROUP BY
        d.name;
    `) as Array<{ name: string; errors: number }>
  }

  private async getErrorsByDeviceType() {
    return (await this.prismaService.$queryRaw`
      SELECT
        COUNT(e.id) AS errors,
        d.type
      FROM
        error_events e
        INNER JOIN devices d ON e.device_id = d.id
      GROUP BY
        d.type;
    `) as Array<{ type: string; errors: number }>
  }

  private async getErrorsByFilename() {
    return (await this.prismaService.$queryRaw`
      SELECT
        COUNT(e.id) AS errors,
        e.line_number as lineNumber,
        e.column_number as columnNumber,
        e.filename
      FROM
        error_events e
      GROUP BY
        e.filename;
    `) as Array<{
      filename: string
      lineNumber: number
      columnNumber: number
      errors: number
    }>
  }
}
