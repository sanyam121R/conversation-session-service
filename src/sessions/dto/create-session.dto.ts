import { IsDate, IsNotEmpty, IsUUID } from "class-validator";

export class CreateSessionDto {
    @IsNotEmpty()
    @IsUUID()
    readonly sessionId: string;
    
    @IsNotEmpty()
    status: "initaited" | "active" | "completed" | "failed";
    
    @IsNotEmpty()
    language: string;
    
    @IsNotEmpty()
    @IsDate()
    startedAt: Date;
    
    @IsDate()
    endedAt: Date | null;
    
    metadata: Object;
}