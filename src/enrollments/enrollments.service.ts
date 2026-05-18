import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Enrollment } from '../entities/enrollment.entity';
import { Subject } from '../entities/subject.entity';
import { User } from '../entities/user.entity';
import { UserRole } from '../auth/constants';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async enroll(studentId: number, createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const student = await this.userRepository.findOne({ where: { id: studentId, role: UserRole.ESTUDIANTE } });
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    const subject = await this.subjectRepository.findOne({ where: { id: createEnrollmentDto.subjectId } });
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }
    const existing = await this.enrollmentRepository.findOne({
      where: { student: { id: studentId }, subject: { id: createEnrollmentDto.subjectId } },
    });
    if (existing) {
      throw new ForbiddenException('Ya estás matriculado en esta materia');
    }
    const enrollment = this.enrollmentRepository.create({ student, subject });
    return this.enrollmentRepository.save(enrollment);
  }

  async getStudentEnrollments(studentId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ where: { student: { id: studentId } } });
  }

  async getSubjectStudents(subjectId: number, docenteId: number): Promise<Enrollment[]> {
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
      relations: ['docente'],
    });
    if (!subject) {
      throw new NotFoundException('Asignatura no encontrada');
    }
    if (!subject.docente || subject.docente.id !== docenteId) {
      throw new ForbiddenException('No tienes permiso para ver los estudiantes de esta materia');
    }
    return this.enrollmentRepository.find({ where: { subject: { id: subjectId } } });
  }
}
