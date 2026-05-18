import { IsNumber } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  subjectId: number;
}
