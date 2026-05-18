import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/constants';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AssignSubjectDto } from './dto/assign-subject.dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCENTE, UserRole.ESTUDIANTE)
  findAll(@Request() req: any, @Query('assigned') assigned?: string) {
    if (assigned === 'true' && req.user.role === UserRole.DOCENTE) {
      return this.subjectsService.findAssigned(req.user.id);
    }
    return this.subjectsService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Patch(':id/assign')
  @Roles(UserRole.ADMIN)
  assignTeacher(@Param('id') id: string, @Body() assignSubjectDto: AssignSubjectDto) {
    return this.subjectsService.assignTeacher(Number(id), assignSubjectDto);
  }

  @Get('assigned')
  @Roles(UserRole.DOCENTE)
  findAssigned(@Request() req: any) {
    return this.subjectsService.findAssigned(req.user.id);
  }
}
