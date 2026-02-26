import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schema/session.schema';
import { Event, EventSchema } from './schema/event.schema';
import { SessionsRepository } from './sessions.repository';
import { EventsRepository } from './events.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository, EventsRepository],
})
export class SessionsModule {}
