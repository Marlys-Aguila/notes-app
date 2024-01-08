import { IsNotEmpty, IsArray, IsNumber, ArrayNotEmpty } from 'class-validator';

export class CreateNoteDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    isArchived: boolean;

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    categories: number[]; 
}
