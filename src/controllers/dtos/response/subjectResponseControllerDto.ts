import {SubjectResponseDto} from "../../../modules/subject";

interface SubjectResponseControllerDto extends SubjectResponseDto {
    associated_coordinator_name: string;
}


export class SubjectResponseControllerDtoHelper {
    // Method to convert Subject model instance to SubjectResponseDto
    public static fromModel(subject: SubjectResponseDto,
        additionalInfo: { associated_coordinator_name: string }
    ): SubjectResponseControllerDto {
        return {
            ...subject,
            ...additionalInfo
        };
    }
  }
