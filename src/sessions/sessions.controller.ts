import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('sessions')
export class SessionsController {
    constructor(private sessionsService: SessionsService) { }

    @Get(':sessionId')
    async findOne(
        @Param('sessionId') sessionId: string,
        @Query('limit') limit = '50',
        @Query('offset') offset = '0',
    ) {
        const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
        const numericOffset = Math.max(parseInt(offset, 10) || 0, 0);
        return this.sessionsService.findOneWithEvents(sessionId, numericLimit, numericOffset);
    }

    @Get()
    async findAll(
        @Query('limit') limit = '50',
        @Query('offset') offset = '0',
    ) {
        const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
        const numericOffset = Math.max(parseInt(offset, 10) || 0, 0);
        return this.sessionsService.findAllSessions(numericLimit, numericOffset);
    }

    @Post()
    async createSession(
        @Res() response,
        @Body() createSessionDto: CreateSessionDto,
    ) {
        const session = await this.sessionsService.createOrGetSession(createSessionDto);
        return response.status(HttpStatus.CREATED).json({
            message: 'Session retrieved or created successfully',
            session,
        });
    }

    @Post(':sessionId/events')
    async addEvent(
        @Param('sessionId') sessionId: string,
        @Res() response,
        @Body() createEventDto: CreateEventDto,
    ) {
        const event = await this.sessionsService.addEventToSession(sessionId, createEventDto);
        return response.status(HttpStatus.CREATED).json({
            message: 'Event added successfully',
            event,
        });
    }

    @Post(':sessionId/complete')
    async completeSession(
        @Param('sessionId') sessionId: string,
        @Res() response,
    ) {
        const session = await this.sessionsService.completeSession(sessionId);
        return response.status(HttpStatus.OK).json({
            message: 'Session completed successfully',
            session,
        });
    }
}