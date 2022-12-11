import { Controller, Get } from '@nestjs/common'

@Controller('/health')
export class HealthController {
  @Get('/status')
  getStatus() {
    return {
      status: 'OK',
    }
  }
}
