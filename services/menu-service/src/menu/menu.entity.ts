import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('menus')
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenant_id: string;

  @Column()
  restaurant_id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
