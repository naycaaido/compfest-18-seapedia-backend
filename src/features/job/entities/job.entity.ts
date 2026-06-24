import { BaseEntity } from "src/common/base_entity";
import { Driver } from "src/features/driver/entities/driver.entity";
import { Order } from "src/features/order/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('jobs')
export class Job extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({type:'timestamp'})
    expired_date!:Date

    @Column({type:'int'})
    earning!:number

    @Column({type:'boolean',default:false})
    is_done!:boolean

    @OneToOne(() => Order, order => order.job,{
        onDelete:'CASCADE',
        cascade:['insert','update']
    })
    @JoinColumn({name:"order_id"})
    order!:Order

    @Column({ name: "driver_id", nullable: true })
    driver_id?: number | null;

    @ManyToOne(() => Driver, driver => driver.jobs,{
        onDelete:'CASCADE',
        cascade:['insert','update'],
        nullable:true
    })
    @JoinColumn({name:"driver_id"})
    driver?:Driver
}
