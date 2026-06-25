import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { Cart } from "src/features/cart/cart/entities/cart.entity";

export default class CartSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 CartSeeder is running');
        const repository = manager.getRepository(Cart)
        await repository.save([
            {
                store_id:2,
                buyer:{
                    id:1
                },
                sub_total: 63000,
                cartItems:[
                    {
                        product:{
                            id:6
                        },
                        sub_total: 63000,
                        quantity:3,
                        cartProductTypes:[
                            {
                                productType:{
                                    id:6
                                },
                                cartProductTypeItems:[
                                    {
                                        productTypeItem:{
                                            id:11
                                        }
                                    }
                                ]
                            }
                            // {
                            //     productType:{
                            //         id:2
                            //     },
                            //     cartProductTypeItems:[
                            //         {
                            //             productTypeItem:{
                            //                 id:3
                            //             }
                            //         },
                            //         {
                            //             productTypeItem:{
                            //                 id:4
                            //             }
                            //         }
                            //     ]
                            // }
                        ]
                    }
                ]
            },
        ])
    }
}