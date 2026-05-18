import { IsNumber } from 'class-validator';

export class AssignSubjectDto {
  @IsNumber()
  docenteId: number;
}
