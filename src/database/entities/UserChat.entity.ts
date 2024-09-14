import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('users_chats')
@Index('idx_usr_chs',['userId', 'chatId'], { unique: true })

export class UserChat {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  public id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  public userId: number;

  @Column({ name: 'chat_id', type: 'bigint' })
  public chatId: number;

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