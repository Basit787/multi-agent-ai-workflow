import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const validationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors) =>
    new BadRequestException({
      error: 'Validation failed',
      details: Object.fromEntries(
        errors.map((e) => [e.property, Object.values(e.constraints ?? {})]),
      ),
    }),
});
