import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { UserRole } from './user.interface';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  heb_name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @Column()
  dob: Date;

  @Column()
  blood: string;

  @Column()
  avatar: string;

  @Column()
  id_nr: string;

  @Column()
  birth_hospital: string;

  @Column()
  birth_place: string;

  @Column()
  heb_family: string;

  @Column()
  eng_name: string;

  @Column()
  eng_family: string;

  @Column()
  phone: string;

  @Column()
  gender: number;

  @Column()
  login: string;

  @Column()
  former_family: string;

  @Column()
  former_eng_family: string;

  @Column()
  map: string;
}
