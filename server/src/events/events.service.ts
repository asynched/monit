import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import type {
  ErrorEvent,
  FetchEvent,
  LoadEvent,
  ViewEvent,
  VisibilityEvent,
} from '@/events/dto'

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createErrorEvent(data: ErrorEvent) {
    return await this.prismaService.errorEvent.create({
      data: {
        ...data,
        user: {
          create: data.user,
        },
        website: {
          create: data.website,
        },
        device: {
          create: data.device,
        },
      },
    })
  }

  async createFetchEvent(data: FetchEvent) {
    return await this.prismaService.fetchEvent.create({
      data: {
        ...data,
        user: {
          create: data.user,
        },
        website: {
          create: data.website,
        },
        device: {
          create: data.device,
        },
      },
    })
  }

  async createLoadEvent(data: LoadEvent) {
    return await this.prismaService.loadEvent.create({
      data: {
        ...data,
        user: {
          create: data.user,
        },
        website: {
          create: data.website,
        },
        device: {
          create: data.device,
        },
      },
    })
  }

  async createViewEvent(data: ViewEvent) {
    return await this.prismaService.viewEvent.create({
      data: {
        ...data,
        user: {
          create: data.user,
        },
        website: {
          create: data.website,
        },
        device: {
          create: data.device,
        },
      },
    })
  }

  async createVisibilityEvent(data: VisibilityEvent) {
    return await this.prismaService.visibilityEvent.create({
      data: {
        ...data,
        user: {
          create: data.user,
        },
        website: {
          create: data.website,
        },
        device: {
          create: data.device,
        },
      },
    })
  }
}
