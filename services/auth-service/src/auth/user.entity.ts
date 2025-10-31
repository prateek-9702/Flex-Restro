import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: 'owner' })
  role: string; // owner, staff, admin

  @Column({ nullable: true })
  tenant_id: string;

  @CreateDateColumn()
  created_at: Date;
}
