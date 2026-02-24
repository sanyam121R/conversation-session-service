import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
    @Prop({ type: String, required: true })
    eventId: string;

    @Prop({ type: String, required: true, index: true })
    sessionId: string;

    @Prop({
        type: String,
        enum: ["user_speech", "bot_speech", "system"],
        required: true,
    })
    type: "user_speech" | "bot_speech" | "system";

    @Prop({ type: Object, required: true })
    payload: Record<string, unknown>;

    @Prop({ type: Date, required: true, index: true })
    timestamp: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ sessionId: 1, eventId: 1 }, { unique: true });
EventSchema.index({ sessionId: 1, timestamp: 1 });