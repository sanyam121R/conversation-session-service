import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
    @Prop()
    eventId: string;
    @Prop()
    sessionId: string;
    @Prop()
    type: "user_speech" | "bot_speech" | "system";
    @Prop()
    payload: Object;
    @Prop()
    timestamp: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);