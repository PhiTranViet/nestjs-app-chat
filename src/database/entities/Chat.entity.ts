import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate,Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('chats')

@Index('chs_name', ['name'], { unique: false })
export class Chat {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  public id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  public name: string;

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