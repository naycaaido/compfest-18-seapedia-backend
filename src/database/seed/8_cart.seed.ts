import { EntityManager } from "typeorm";
import { Seeder } from "./main.seed";
import { Cart } from "src/features/cart/cart/entities/cart.entity";

export default class CartSeeder implements Seeder {
    async run(manager: EntityManager): Promise<any> {
        console.log('🔥 CartSeeder is running');
        const repository = manager.getRepository(Cart)
        await repository.save([
            {
                store_id:1,
                buyer:{
                    id:1
                },
                sub_total: 178350,
                cartItems:[
                    {
                        product:{
                            id:1
                        },
                        sub_total: 178350,
                        quantity:3,
                        cartProductTypes:[
                            {
                                productType:{
                                    id:1
                                },
                                cartProductTypeItems:[
                                    {
                                        productTypeItem:{
                                            id:1
                                        }
                                    }
                                ]
                            },
                            {
                                productType:{
                                    id:2
                                },
                                cartProductTypeItems:[
                                    {
                                        productTypeItem:{
                                            id:3
                                        }
                                    },
                                    {
                                        productTypeItem:{
                                            id:4
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ])
    }
}