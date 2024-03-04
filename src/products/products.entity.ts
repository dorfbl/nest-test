import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity({ name: 'orders' })
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column()
  description: string;

  @Column()
  qty: number;

  @Column()
  price: number;

  @Column()
  store: string;

  @Column()
  orderdate: Date;

  @Column()
  ordernr: string;

  @Column("text", {array: true} )
  tags: string[];

  @Column()
  img: string;

  @Column()
  manu: string;

  @Column()
  model: string;

  @Column()
  category: string;

  @Column()
  active: boolean;

}
