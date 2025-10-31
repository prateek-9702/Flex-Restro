import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('restaurants')
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  tax_rate: number;

  @Column({ nullable: true })
  qr_code_url: string;

  @CreateDateColumn()
  created_at: Date;
}
