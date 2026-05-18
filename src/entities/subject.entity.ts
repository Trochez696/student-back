import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from './user.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  codigo: string;

  @Column({ nullable: true })
  descripcion?: string;

  @ManyToOne(() => User, (user) => user.assignedSubjects, { nullable: true, eager: true })
  docente: User;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.subject)
  enrollments: Enrollment[];
}
