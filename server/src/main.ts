import { NestFactory } from '@nestjs/core'
import { FastifyAdapter } from '@nestjs/platform-fastify'
import { AppModule } from '@/app.module'

import '@/polyfills/bigint.polyfill'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, new FastifyAdapter())

  app.enableCors({
    origin: '*',
  })

  await app.listen(3333)
}

bootstrap()
