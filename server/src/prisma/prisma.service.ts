import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  async onModuleInit() {
    this.logger.log('PrismaService: onModuleInit')
    await this.$connect()
  }

  async onModuleDestroy() {
    this.logger.log('PrismaService: onModuleDestroy')
    await this.$disconnect()
  }
}
