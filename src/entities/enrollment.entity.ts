import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { User } from './user.entity';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments, { eager: true })
  student: User;

  @ManyToOne(() => Subject, (subject) => subject.enrollments, { eager: true })
  subject: Subject;
}
