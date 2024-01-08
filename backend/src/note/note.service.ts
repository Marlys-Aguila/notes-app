import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { Category } from 'src/entities/category.entity';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(Note)
        private noteRepository: Repository<Note>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) { }

    async create(createNoteDto: CreateNoteDto): Promise<Note> {
        const note = new Note();
        note.title = createNoteDto.title;
        note.content = createNoteDto.content;
        note.isArchived = createNoteDto.isArchived;

    if (createNoteDto.categories && createNoteDto.categories.length > 0) {
        note.categories = await this.categoryRepository.findBy({
            categoryId: In(createNoteDto.categories)
        });
    }

        return this.noteRepository.save(note);
    }

    findAll() {
        return this.noteRepository.find({ relations: ['categories'] });
    }

    findOne(id: number) {
        return this.noteRepository.findOne({
            where: { noteId: id },
            relations: ['categories'],
        });
    }

    async update(id: number, updateNoteDto: UpdateNoteDto) {
        const note = await this.noteRepository.findOne({
            where: { noteId: id },
            relations: ['categories']
        });

        if (!note) {
            throw new Error('Nota no encontrada');
        }

        note.title = updateNoteDto.title;
        note.content = updateNoteDto.content;
        note.isArchived = updateNoteDto.isArchived;

        if (updateNoteDto.categories) {
            if (updateNoteDto.categories.length > 0) {
                   note.categories = await this.categoryRepository.findBy({ categoryId: In(updateNoteDto.categories) });
                if (note.categories.length !== updateNoteDto.categories.length) {
                    throw new Error('No se pudo encontrar una o más categorias');
                }
            } else {
                note.categories = [];
            }
        }

        const toUpdate = await this.noteRepository.preload(note)
        return this.noteRepository.save(note);
    }

    async remove(id: number) {
            const note = await this.noteRepository.findOne({
            where: { noteId: id },
            relations: ['categories']
        });
    
        if (!note) {
            throw new Error('Nota no encontrada');
        }
    
        if (note.categories.length > 0) {
            note.categories = [];
            await this.noteRepository.save(note);
        }

        return this.noteRepository.delete(id);
    }    
}
