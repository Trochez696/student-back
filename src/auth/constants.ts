export enum UserRole {
  ADMIN = 'ADMIN',
  DOCENTE = 'DOCENTE',
  ESTUDIANTE = 'ESTUDIANTE',
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'supersecretkey',
  expiresIn: '8h',
};
