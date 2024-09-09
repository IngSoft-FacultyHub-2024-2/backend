import { HourConfigResponseDto } from "../../../modules/subject";

export interface HourConfigResponseControllerDto {
    id: number;
    subject_id: number;
    role: string;
    total_hours: number;
    weekly_hours: number;
}

export class HourConfigResponseControllerDtoHelper {
    // Method to convert HourConfigResponseDto model instance to HourConfigResponseControllerDto
    public static fromModel(hourConfig: HourConfigResponseDto): HourConfigResponseControllerDto {
        return {
            id: hourConfig.id,
            subject_id: hourConfig.subject_id,
            role: hourConfig.role,
            total_hours: hourConfig.total_hours,
            weekly_hours: hourConfig.weekly_hours,
        };
    }
}