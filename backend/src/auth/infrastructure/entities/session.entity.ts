import { UserEntity } from '@/users/infrastructure/entities/user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('sessions')
@Index(['userId'])
export class SessionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'datetime' })
  expAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  isExpired(): boolean {
    return new Date() > this.expAt;
  }

  isValid(): boolean {
    return this.isActive && !this.isExpired();
  }

  deactivate(): void {
    this.isActive = false;
  }
}
