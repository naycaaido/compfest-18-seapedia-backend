import { DeepPartial } from "typeorm";
import { CreateProductDto } from "../product/dto/create-product.dto";
import { UpdateProductDto } from "../product/dto/update-product.dto";
import { Product } from "../product/entities/product.entity";
import { ProductType } from "../product-type/entities/product-type.entity";
import { CreateProductTypeDto } from "../product-type/dto/create-product-type.dto";
import { UpdateProductTypeDto } from "../product-type/dto/update-product-type.dto";

export function mapToProduct(dto:CreateProductDto | UpdateProductDto):DeepPartial<Product>{
    return {
        ...dto,
        types: mapToProductTypesFromProduct(dto),
        category: dto.category_id
            ? { id: dto.category_id } 
            : undefined,
    }
}


export function mapToProductMerge(dto:CreateProductDto | UpdateProductDto):DeepPartial<Product>{
    const { types, category_id, ...rest } = dto;
    return {
        ...rest,
        category: dto.category_id
            ? { id: dto.category_id } 
            : undefined,
    }
}

export function mapToProductTypesFromProduct(dto:CreateProductDto | UpdateProductDto): DeepPartial<ProductType>[]{
      return (dto.types ?? []).map(type => ({
            name:type.name,
            is_multiple:type.is_multiple,
            is_required:type.is_required,
            items: (type.items ?? []).map(item => ({
                name:item.name,
                stock:item.stock,
                price:item.price
                }))
            }))
}

export function mapToProductTypeFromProduct(dto:CreateProductTypeDto | UpdateProductTypeDto): DeepPartial<ProductType>{
      return {
            name:dto.name,
            is_multiple:dto.is_multiple,
            is_required:dto.is_required,
            product:{
                id:dto.product_id
            },
            items: (dto.items ?? []).map(item => ({
                name:item.name,
                stock:item.stock,
                price:item.price
                }))
        
      }
}