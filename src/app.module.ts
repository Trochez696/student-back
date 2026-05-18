import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { User } from './entities/user.entity';
import { Subject } from './entities/subject.entity';
import { Enrollment } from './entities/enrollment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '3306'), 10),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASSWORD', 'password'),
        database: config.get('DB_NAME', 'university'),
        entities: [User, Subject, Enrollment],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}
