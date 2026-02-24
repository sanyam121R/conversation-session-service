import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './schema/session.schema';

@Injectable()
export class SessionsService {

    constructor(@InjectModel('Session') private sessionModel:Model<Session>){}

    async findOne(id: string) {
        if (!id) throw new NotFoundException();
        return {id};
    }

    async createSession(createSession: CreateSessionDto): Promise<Session>{
        const newSession = await new this.sessionModel(createSession);
        return newSession.save();
    }

    async getAllSession(): Promise<Session[]> {
        const sessions = await this.sessionModel.find();
        if (!sessions || sessions.length===0){
            throw new NotFoundException('No Sessions found!');
        }
        return sessions;
    }
}
