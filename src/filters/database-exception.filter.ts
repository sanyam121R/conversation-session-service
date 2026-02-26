import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DatabaseExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const { status, message, error } = this.resolveException(exception);

        if (status >= 500) this.logger.error(exception);

        response.status(status).json({ statusCode: status, message, error });
    }

    private resolveException(exception: unknown): {
        status: number;
        message: string | string[];
        error: string;
    } {
        // NestJS HTTP exceptions already carry the correct status and message.
        if (exception instanceof HttpException) {
            const response = exception.getResponse();
            return {
                status: exception.getStatus(),
                message:
                    typeof response === 'object' && 'message' in response
                        ? (response as any).message
                        : exception.message,
                error: HttpStatus[exception.getStatus()] ?? 'Error',
            };
        }

        // Mongoose cast error — invalid value for a schema field (e.g. malformed date).
        if (exception instanceof MongooseError.CastError) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: `Invalid value for field '${exception.path}': ${exception.value}`,
                error: 'Bad Request',
            };
        }

        // Mongoose schema-level validation failure.
        if (exception instanceof MongooseError.ValidationError) {
            return {
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                message: Object.values(exception.errors).map((e) => e.message),
                error: 'Unprocessable Entity',
            };
        }

        if (exception instanceof MongoServerError) {
            if (exception.code === 11000) {
                // Duplicate key - this is EXPECTED behavior for idempotency!
                return {
                    status: HttpStatus.CONFLICT, // 409
                    message: 'Event already exists',
                    error: 'Conflict',
                };
            }

            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'A database error occurred. Please try again later.',
                error: 'Internal Server Error',
            };
        }

        // Fallback for anything unanticipated.
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred. Please try again later.',
            error: 'Internal Server Error',
        };
    }
}