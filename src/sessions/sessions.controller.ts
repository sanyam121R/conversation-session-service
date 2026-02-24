import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
    constructor(
        private sessionsService: SessionsService
    ) { }

    // Get Sessions
    @Get(':sessionId')
    findOne(@Param('sessionId') sessionId: string) {
        try {
            this.sessionsService.findOne(sessionId);
        } catch (error) {
            // if (error instanceof DatabaseException) {
            throw new NotFoundException();
            // }
        }
    }

    @Get('sessions')
    async getSessions(@Res() response) {
        try {
            const sessions = await this.sessionsService.getAllSession();
            return response.status(HttpStatus.OK).json({
                message: "All sessions found",
                sessions
            })
        } catch (error) {
            return response.status(error.status).json(error.response)
        }
    }

    // Post Sessions
    @Post()
    async createSession(@Res() response, @Body() createSessionDto: CreateSessionDto) {
        try {
            const newSession = await this.sessionsService.createSession(createSessionDto);
            return response.status(HttpStatus.CREATED).json({
                message: "Session has been created successfully!",
                session: newSession
            })
        } catch (error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: session was not created!',
                error: 'Bad request'
            })
        }
    }
}
