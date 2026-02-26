import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
    @Prop({ type: String, unique: true, index: true })
    sessionId: string;

    @Prop({
        type: String,
        enum: ["initiated", "active", "completed", "failed"],
        index: true,
    })
    status: "initiated" | "active" | "completed" | "failed";

    @Prop({ type: String })
    language: string;

    @Prop({ type: Date, required: true, index: true })
    startedAt: Date;

    @Prop({ type: Date, required: false, default: null, index: true })
    endedAt?: Date;

    @Prop({ type: Object, required: false })
    metadata?: Record<string, unknown>;
}

export const SessionSchema = SchemaFactory.createForClass(Session);