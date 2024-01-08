import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Category } from './entities/category.entity';
import { NoteModule } from './note/note.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_SERVER || '127.0.0.1',
      port: parseInt(process.env.DB_PORT) || 1433,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Note, Category],
      synchronize: false,
      extra: {
        trustServerCertificate: true, 
      },
    }),
    NoteModule,
    CategoryModule,
  ],
})
export class AppModule {}
