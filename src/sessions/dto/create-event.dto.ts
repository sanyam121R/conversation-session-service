import { IsDate, IsIn, IsISO8601, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    @IsUUID()
    readonly eventId: string;
    
    @IsNotEmpty()
    @IsUUID()
    readonly sessionId: string;
    
    @IsNotEmpty()
    @IsString()
    @IsIn(["user_speech", "bot_speech", "system"])
    type: "user_speech" | "bot_speech" | "system";
    
    @IsNotEmpty()
    payload: Record<string, unknown>;
    
    @IsNotEmpty()
    @IsISO8601()
    timestamp: Date;
}