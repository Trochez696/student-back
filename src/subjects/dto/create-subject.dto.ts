import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  // Alias tolerado para evitar 400 por typo en clientes existentes
  @IsString()
  @IsOptional()
  descipcion?: string;
}
