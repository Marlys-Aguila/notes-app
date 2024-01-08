import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NoteController {
    constructor(private readonly noteService: NoteService) {}

    @Post()
    async create(@Body() noteData: CreateNoteDto) {
        return await this.noteService.create(noteData);
    }

    @Get()
    findAll() {
        return this.noteService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.noteService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() noteData: UpdateNoteDto) {
        return await this.noteService.update(id, noteData);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.noteService.remove(id);
    }
}
