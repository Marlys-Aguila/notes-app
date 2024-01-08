import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Categories')
export class Category {
    @PrimaryGeneratedColumn()
    categoryId: number;

    @Column()
    name: string;
}
