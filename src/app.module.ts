import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionsModule } from './sessions/sessions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB_CONNECTION_STRING } from './credStore';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_CONNECTION_STRING, { dbName: "voiceAI" }),
    SessionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
