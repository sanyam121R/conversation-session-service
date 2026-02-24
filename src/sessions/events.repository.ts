import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schema/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async createIfNotExists(dto: CreateEventDto): Promise<EventDocument> {
    const filter = {
      sessionId: dto.sessionId,
      eventId: dto.eventId,
    };

    const update = {
      $setOnInsert: {
        sessionId: dto.sessionId,
        eventId: dto.eventId,
        type: dto.type,
        payload: dto.payload,
        timestamp: dto.timestamp,
      },
    };

    const result = await this.eventModel.findOneAndUpdate(filter, update, {
      returnDocument: 'after',
      upsert: true,
    });

    return result;
  }

  async findBySessionIdPaginated(
    sessionId: string,
    limit: number,
    offset: number,
  ): Promise<{ events: EventDocument[]; total: number }> {
    const [events, total] = await Promise.all([
      this.eventModel
        .find({ sessionId })
        .sort({ timestamp: 1 })
        .skip(offset)
        .limit(limit)
        .exec(),
      this.eventModel.countDocuments({ sessionId }).exec(),
    ]);

    return { events, total };
  }
}

