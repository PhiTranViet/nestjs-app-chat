import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { nowInMillis } from '../../shared/Utils'

@Entity('users')

export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  public id: number;

  @Column({ name: 'username', type: 'varchar', length: 100, unique: true })
  public username: string;

  @Column({ name: 'email', type: 'varchar', length: 191, nullable: false, unique: true })
  public email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false, default: '' })
  public password: string;

  @Column({name: 'token', type: 'varchar', length: 255, nullable: true})
  public token: string;

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