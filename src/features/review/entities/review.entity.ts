import { User } from "src/features/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"app_review"})
export class AppReview {
    @PrimaryGeneratedColumn()
    id!:number

    @Column({name:"reviewer_name",type:"varchar",length:255})
    reviewer_name!:string

    @Column({type:"varchar",length:255})
    comment!:string

    @Column({type:"smallint"})
    rating!:number

    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({name:"user_id"})
    user?:User
}
