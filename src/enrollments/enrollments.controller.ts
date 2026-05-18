import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/constants';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles(UserRole.ESTUDIANTE)
  enroll(@Request() req: any, @Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.enroll(req.user.id, createEnrollmentDto);
  }

  @Get('my')
  @Roles(UserRole.ESTUDIANTE)
  myEnrollments(@Request() req: any) {
    return this.enrollmentsService.getStudentEnrollments(req.user.id);
  }

  @Get('subject/:id/students')
  @Roles(UserRole.DOCENTE)
  subjectStudents(@Request() req: any, @Param('id') id: string) {
    return this.enrollmentsService.getSubjectStudents(Number(id), req.user.id);
  }
}
