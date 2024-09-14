import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('messages')
@Index('ms_chat_id_created_at',['chatId', 'createdAt'], { unique: true })
@Index('ms_group_id_created_at',['groupId', 'createdAt'], { unique: true })
@Index('ms_user_id',['userId'], { unique: false })         
@Index('ms_type_created_at',['type', 'createdAt'], { unique: false })
export class Message {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  public id: number;

  @Column({ name: 'chat_id', type: 'bigint' })
  public chatId: number;

  @Column({ name: 'group_id', type: 'bigint', nullable: true })
  public groupId: number;

  @Column({ name: 'user_id', type: 'bigint' })
  public userId: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ['text', 'image', 'video'],
  })
  public type: 'text' | 'image' | 'video';

  @Column({ name: 'content', type: 'text' })
  public content: string;


  @Column({ name: 'sent_at', type: 'bigint', nullable: true })
  public sentAt: number;

  @Column({ name: 'delivered_at', type: 'bigint', nullable: true })
  public deliveredAt: number;

  @Column({ name: 'seen_at', type: 'bigint', nullable: true })
  public seenAt: number;

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