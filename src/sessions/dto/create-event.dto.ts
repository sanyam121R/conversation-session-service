import { IsDate, IsNotEmpty, IsUUID } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    @IsUUID()
    readonly eventId: string;
    
    @IsNotEmpty()
    @IsUUID()
    readonly sessionId: string;
    
    @IsNotEmpty()
    type: "user_speech" | "bot_speech" | "system";
    
    @IsNotEmpty()
    payload: Object;
    
    @IsDate()
    timestamp: Date;
}