import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class FallbackExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(
      'fallback exception handler triggered' + exception,
      JSON.stringify(exception),
    );

    const ctx = host.switchToHttp(),
      response = ctx.getResponse();
    // TODO
    return response.status(500).json({
      statusCode: 500,
      createdBy: 'FallbackExceptionFilter',
      errorMessage: exception.message
        ? exception.message
        : 'Unexpected error ocurred',
    });
  }
}
