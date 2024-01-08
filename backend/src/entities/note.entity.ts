import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './category.entity';

@Entity('Notes')
export class Note {
    @PrimaryGeneratedColumn()
    noteId: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column()
    isArchived: boolean;

    @ManyToMany(() => Category,  { cascade: true })
    @JoinTable({
        name: 'NoteCategories', 
        joinColumn: { name: 'noteId', referencedColumnName: 'noteId' },
        inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'categoryId' },
    })
    
    categories: Category[];
}
