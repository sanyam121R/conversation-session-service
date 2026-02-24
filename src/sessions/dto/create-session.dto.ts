import { Type } from "class-transformer";
import { IsDate, IsIn, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSessionDto {
    @IsNotEmpty()
    @IsUUID()
    readonly sessionId: string;
    
    @IsNotEmpty()
    @IsString()
    @IsIn(["initiated", "active", "completed", "failed"])
    status: "initiated" | "active" | "completed" | "failed";
    
    @IsNotEmpty()
    @IsString()
    language: string;
    
    @IsNotEmpty()
    @IsISO8601()
    startedAt: Date;
    
    @IsOptional()
    @IsISO8601()
    endedAt?: Date;
    
    @IsOptional()
    metadata?: Record<string, unknown>;
}