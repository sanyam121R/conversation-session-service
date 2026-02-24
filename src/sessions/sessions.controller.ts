import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Query, Res } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('sessions')
export class SessionsController {
    constructor(
        private sessionsService: SessionsService
    ) { }

    // Get Sessions
    @Get(':sessionId')
    async findOne(
        @Param('sessionId') sessionId: string,
        @Query('limit') limit = '50',
        @Query('offset') offset = '0',
    ) {
        try {
            const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
            const numericOffset = Math.max(parseInt(offset, 10) || 0, 0);
            return await this.sessionsService.findOneWithEvents(
                sessionId,
                numericLimit,
                numericOffset,
            );
        } catch (error) {
            // if (error instanceof DatabaseException) {
            throw new NotFoundException();
            // }
        }
    }

    // Post Sessions
    @Post()
    async createSession(@Res() response, @Body() createSessionDto: CreateSessionDto) {
        try {
            const session = await this.sessionsService.createOrGetSession(createSessionDto);
            return response.status(HttpStatus.CREATED).json({
                message: "Session retrieved or created successfully",
                session,
            })
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: session was not created!',
                error: 'Bad request'
            })
        }
    }

    @Post(':sessionId/events')
    async addEvent(
        @Param('sessionId') sessionId: string,
        @Res() response,
        @Body() createEventDto: CreateEventDto,
    ) {
        try {
            const event = await this.sessionsService.addEventToSession(sessionId, createEventDto);
            return response.status(HttpStatus.CREATED).json({
                message: "Event added successfully",
                event,
            });
        } catch (error) {
            if (error.status && error.response) {
                return response.status(error.status).json(error.response);
            }
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: event was not created!',
                error: 'Bad request',
            });
        }
    }

    @Post(':sessionId/complete')
    async completeSession(
        @Param('sessionId') sessionId: string,
        @Res() response,
    ) {
        try {
            const session = await this.sessionsService.completeSession(sessionId);
            return response.status(HttpStatus.OK).json({
                message: "Session completed successfully",
                session,
            });
        } catch (error) {
            if (error.status && error.response) {
                return response.status(error.status).json(error.response);
            }
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: session was not completed!',
                error: 'Bad request',
            });
        }
    }
}
