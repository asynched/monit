import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ZodPipe } from '@/pipes/zod.pipe'
import {
  errorEventSchema,
  fetchEventSchema,
  loadEventSchema,
  viewEventSchema,
  visibilityEventSchema,
} from '@/events/dto'
import { EventsService } from '@/events/events.service'
import type {
  ErrorEvent,
  FetchEvent,
  LoadEvent,
  ViewEvent,
  VisibilityEvent,
} from '@/events/dto'

@Controller('/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('/error')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createErrorEvent(
    @Body(new ZodPipe(errorEventSchema)) data: ErrorEvent
  ) {
    this.eventsService.createErrorEvent(data)
  }

  @Post('/fetch')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createFetchEvent(
    @Body(new ZodPipe(fetchEventSchema)) data: FetchEvent
  ) {
    this.eventsService.createFetchEvent(data)
  }

  @Post('/load')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createLoadEvent(@Body(new ZodPipe(loadEventSchema)) data: LoadEvent) {
    this.eventsService.createLoadEvent(data)
  }

  @Post('/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createViewEvent(@Body(new ZodPipe(viewEventSchema)) data: ViewEvent) {
    this.eventsService.createViewEvent(data)
  }

  @Post('/visibility')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createVisibilityEvent(
    @Body(new ZodPipe(visibilityEventSchema)) data: VisibilityEvent
  ) {
    this.eventsService.createVisibilityEvent(data)
  }
}
