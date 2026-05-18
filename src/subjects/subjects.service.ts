import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AssignSubjectDto } from './dto/assign-subject.dto';
import { Subject } from '../entities/subject.entity';
import { User } from '../entities/user.entity';
import { UserRole } from '../auth/constants';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectRepository.create({
      nombre: createSubjectDto.nombre,
      codigo: createSubjectDto.codigo,
      descripcion: createSubjectDto.descripcion ?? createSubjectDto.descipcion,
    });
    return this.subjectRepository.save(subject);
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  async findAssigned(docenteId: number): Promise<Subject[]> {
    return this.subjectRepository.find({ where: { docente: { id: docenteId } } });
  }

  async assignTeacher(subjectId: number, assignDto: AssignSubjectDto): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }
    const teacher = await this.userRepository.findOne({
      where: { id: assignDto.docenteId, role: UserRole.DOCENTE },
    });
    if (!teacher) {
      throw new NotFoundException('Docente no encontrado');
    }
    subject.docente = teacher;
    return this.subjectRepository.save(subject);
  }
}
