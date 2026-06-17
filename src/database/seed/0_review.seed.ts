import { AppReview } from "src/features/review/entities/review.entity";
import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";

export default class ReviewSeeder implements Seeder {
    track?: boolean | undefined;
    async run(manager:EntityManager): Promise<any> {
        await manager.getRepository(AppReview).insert([
            {
                comment:"Bagus",
                rating:5,
                reviewer_name:"Asep"
            },
            {
                comment:"Biasa",
                rating:3,
                reviewer_name:"Joseph"
            },
            {
                comment:"Jelek",
                rating:1,
                reviewer_name:"Bunga"
            }
        ])
    }
}