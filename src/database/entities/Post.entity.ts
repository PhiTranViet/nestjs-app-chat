import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('posts')
@Index('pos_author_id', ['authorId'], { unique: false })
@Index('pos_title', ['title'], { unique: false })

export class Post {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  public id: number;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  public title: string;

  @Column({ name: 'content', type: 'text', nullable: true })
  public content: string;

  @Column({ name: 'author_id', type: 'bigint' })
  public authorId: number;

  @Column({ name: 'created_at', type: 'bigint', nullable: true })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: true })
  public updatedAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = nowInMillis();
    this.updatedAt = nowInMillis();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = nowInMillis();
  }
}