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
  ) { }

  async createIfNotExists(dto: CreateEventDto): Promise<{ event: EventDocument, exists: boolean }> {
    try {
      // Attempt to create
      const event = await this.eventModel.create({
        sessionId: dto.sessionId,
        eventId: dto.eventId,
        type: dto.type,
        payload: dto.payload,
        timestamp: dto.timestamp,
      });

      return { event, exists: false };
    } catch (error: any) {
      if (error.code === 11000) {
        const existingEvent = await this.eventModel.findOne({
          sessionId: dto.sessionId,
          eventId: dto.eventId,
        });

        return { event: existingEvent as EventDocument, exists: true };
      }
      throw error;
    }
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

