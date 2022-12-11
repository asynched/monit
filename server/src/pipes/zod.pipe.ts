import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import type { ZodSchema } from 'zod'

@Injectable()
export class ZodPipe<T> implements PipeTransform<any, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: any) {
    const result = this.schema.safeParse(value)

    if (result.success) {
      return result.data
    }

    throw new BadRequestException(result.error.issues)
  }
}
