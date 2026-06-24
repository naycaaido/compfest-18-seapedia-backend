import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Job } from "src/features/job/entities/job.entity";

@Entity({name:"drivers"})
export class Driver extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @OneToOne(() => User, (user) => user.driver,{
        onDelete:'CASCADE',
    })
    @JoinColumn({name:"user_id"})
    user!:User

    @OneToMany(() => Job, jobs => jobs.driver,{
        cascade:['insert']
    })
    jobs!:Job[]
}