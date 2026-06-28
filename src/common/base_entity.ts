import { Expose } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {

  @Expose({name:"created_at"})
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Expose({name:"updated_at"})
  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt!: Date;

  @DeleteDateColumn()
  deleted_at!:Date
}