import { CreateProductTypeDto } from "src/features/product/product-type/dto/create-product-type.dto";
import { UpdateProductTypeDto } from "src/features/product/product-type/dto/update-product-type.dto";
import { ProductType } from "src/features/product/product-type/entities/product-type.entity";
import { CreateProductDto } from "src/features/product/product/dto/create-product.dto";
import { UpdateProductDto } from "src/features/product/product/dto/update-product.dto";
import { Product } from "src/features/product/product/entities/product.entity";
import { DeepPartial } from "typeorm";
import { CartItem } from "../cart-item/entities/cart-item.entity";
import { CreateCartItemDto } from "../cart-item/dto/create-cart-item.dto";
import { UpdateCartItemDto } from "../cart-item/dto/update-cart-item.dto";


export function mapToCartItem(dto:CreateCartItemDto | UpdateCartItemDto,cartId?:number | undefined):DeepPartial<CartItem>{
        return {
            cart:{
                id:cartId
            },
            quantity:dto.quantity,
            product:{
                id:dto.product_id
            },
            cartProductTypes:dto.types?.map((type) => ({
                productType:{
                    id:type.product_type_id
                },
                cartProductTypeItems: type.items?.map((item) => ({
                    productTypeItem:{
                        id:item.product_type_item_id
                    }
                }))
            }))
    }
}

