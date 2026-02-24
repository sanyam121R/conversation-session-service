import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schema/session.schema';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) { }

  async upsertBySessionId(dto: CreateSessionDto): Promise<SessionDocument> {
    const filter = { sessionId: dto.sessionId };
    const update = {
      $setOnInsert: {
        sessionId: dto.sessionId,
        status: dto.status,
        language: dto.language,
        startedAt: dto.startedAt,
        endedAt: dto.endedAt ?? null,
        metadata: dto.metadata ?? {},
      },
    };

    const result = await this.sessionModel.findOneAndUpdate(filter, update, {
      returnDocument: 'after',
      upsert: true,
    });

    return result;
  }

  async findBySessionId(sessionId: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ sessionId }).exec();
  }

  async completeSession(sessionId: string, endedAt: Date): Promise<SessionDocument | null> {
    return this.sessionModel
      .findOneAndUpdate(
        { sessionId },
        {
          $set: {
            status: 'completed',
            endedAt,
          },
        },
        {
          returnDocument: 'after',
          upsert: true,
        },
      )
      .exec();
  }
}

