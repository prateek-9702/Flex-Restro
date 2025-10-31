import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MenuEntity } from './menu.entity';

@Entity('menu_items')
export class MenuItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  menu_id: number;

  @ManyToOne(() => MenuEntity)
  @JoinColumn({ name: 'menu_id' })
  menu: MenuEntity;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'json', nullable: true })
  variants: any;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
