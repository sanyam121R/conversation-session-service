import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
    @Prop({ type: String })
    sessionId: string;

    @Prop({ type: String })
    status: "initaited" | "active" | "completed" | "failed";

    @Prop({ type: String })
    language: string;

    @Prop({ type: Date })
    startedAt: Date;

    @Prop({ type: Date || null })
    endedAt: Date | null;

    @Prop({ type: Object })
    metadata: Object;
}

export const SessionSchema = SchemaFactory.createForClass(Session);