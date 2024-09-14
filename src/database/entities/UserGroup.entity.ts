import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { nowInMillis } from '../../shared/Utils';

@Entity('users_groups')
@Index('idx_usr_grp',['userId', 'groupId'], { unique: true })

export class UserGroup {
    @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
    public id: number;

    @Column({ name: 'user_id', type: 'bigint' })
    public userId: number;

    @Column({ name: 'group_id', type: 'bigint', nullable: true })
    public groupId: number;
  

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