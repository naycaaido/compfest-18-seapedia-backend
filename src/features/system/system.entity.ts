import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"system"})
export class System extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:"date"})
    current_date!:string
}