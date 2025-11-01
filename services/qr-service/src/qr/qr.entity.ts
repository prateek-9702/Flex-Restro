import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum QRType {
  RESTAURANT = 'restaurant',
  TABLE = 'table',
  ORDER = 'order',
}

@Entity()
export class QR {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  restaurant_id: string;

  @Column({
    type: 'enum',
    enum: QRType,
    default: QRType.RESTAURANT,
  })
  type: QRType;

  @Column({ nullable: true })
  table_number: number;

  @Column({ nullable: true })
  order_id: string;

  @Column()
  short_url: string;

  @Column()
  qr_code_url: string;

  @Column('text')
  data: string; // JSON string containing the QR data

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
