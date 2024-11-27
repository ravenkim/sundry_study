import { applyDecorators, SetMetadata } from '@nestjs/common'
import { ApiBearerAuth as SwaggerApiBearerAuth } from '@nestjs/swagger'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
