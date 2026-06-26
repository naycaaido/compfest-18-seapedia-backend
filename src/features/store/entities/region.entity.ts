import { BaseEntity } from "src/common/base_entity";
import { Column, Entity, PrimaryColumn } from "typeorm";


export abstract class Region extends BaseEntity {
    @PrimaryColumn({ type: 'int' })
    id!:number

    @Column({type:'varchar',length:255})
    name!:string
}

@Entity({name:'provinces'})
export class Province extends Region{}

@Entity({name:'cities'})
export class City extends Region{}

@Entity({name:'districts'})
export class District extends Region{}

@Entity({name:'villages'})
export class Village extends Region{}