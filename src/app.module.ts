import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionsModule } from './sessions/sessions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './sessions/schema/session.schema';
import { EventSchema } from './sessions/schema/event.schema';

@Module({
  imports: [
    MongooseModule.forRoot('monogdb://127.0.0.1:27017', { dbName: "voiceAI" }),
    MongooseModule.forFeature([
      { name: 'Session', schema: SessionSchema },
      { name: 'Event', schema: EventSchema }
    ]),
    SessionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
