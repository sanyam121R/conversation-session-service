import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { SessionsRepository } from './sessions.repository';
import { EventsRepository } from './events.repository';

@Injectable()
export class SessionsService {

    constructor(
        private readonly sessionsRepository: SessionsRepository,
        private readonly eventsRepository: EventsRepository,
    ){}

    async findOneWithEvents(
        sessionId: string,
        limit: number,
        offset: number,
    ) {
        const session = await this.sessionsRepository.findBySessionId(sessionId);
        if (!session) {
            throw new NotFoundException(`Session ${sessionId} not found`);
        }

        const { events, total } = await this.eventsRepository.findBySessionIdPaginated(
            sessionId,
            limit,
            offset,
        );

        return {
            session,
            events,
            pagination: {
                limit,
                offset,
                total,
            },
        };
    }

    async createOrGetSession(createSession: CreateSessionDto) {
        return this.sessionsRepository.upsertBySessionId(createSession);
    }

    async addEventToSession(sessionId: string, createEventDto: CreateEventDto) {
        if (createEventDto.sessionId !== sessionId) {
            throw new BadRequestException('Body sessionId must match URL sessionId');
        }

        const session = await this.sessionsRepository.findBySessionId(sessionId);
        if (!session) {
            throw new NotFoundException(`Session ${sessionId} not found`);
        }

        return this.eventsRepository.createIfNotExists(createEventDto);
    }

    async completeSession(sessionId: string) {
        const now = new Date();
        const session = await this.sessionsRepository.completeSession(sessionId, now);
        if (!session) {
            throw new NotFoundException(`Session ${sessionId} not found`);
        }
        return session;
    }
}
