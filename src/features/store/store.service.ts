import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { log } from 'console';
import { File } from '../image/constant';
import { ImageService } from '../image/image.service';
import { DirType, Payload } from 'src/common/utils';
import path from 'path';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { UserRole } from '../user/entities/role_user.enum';

@Injectable()
export class StoreService {

  constructor(
    @InjectRepository(Store)
    private storeRepository:Repository<Store>,
    private readonly imageService:ImageService
  ) {}

  async create(sellerId:number,createStoreDto: CreateStoreDto,file:File|null) {
    let image_url:string | undefined = undefined

    if (file){
      image_url = this.imageService.makeFileName(file.fileName)
    }
  
    try {
      const store = this.storeRepository.create({
        ...createStoreDto,
        image_id: image_url ? path.join(DirType.STORE, image_url) : undefined,
        seller:{
          id:sellerId
        }
      })
      const result = await this.storeRepository.save(store)
      if (file){
        await this.imageService.writeImage(file,image_url!,DirType.STORE)
      }
    return result
    } catch (error) {
      throw error
    }
  }

  async update(updateStoreDto: UpdateStoreDto, payload:Payload ,file: File | null) {
      let image_url:string | undefined = undefined

    if (file){
      image_url = this.imageService.makeFileName(file.fileName)
    }
    try {
      const store = await this.storeRepository.findOne({
        where:{
          seller:{
            id:payload.userRoleId
          }
        },
        relations:{
          seller:true
        }
      })
      if(!store){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Please Create Store first'))
      }
      const storeCreated = this.storeRepository.create({
        ...updateStoreDto,
        image_id: image_url ? path.join(DirType.STORE, image_url) : undefined,
      })

      const oldImageId = store.image_id

      const updatedStore = this.storeRepository.merge(store,storeCreated)
      log(updatedStore)
      const result = await this.storeRepository.save(store)
      if (file){
        await this.imageService.writeImage(file,image_url!,DirType.STORE)
      }
      if(oldImageId){
        await this.imageService.removeImage(oldImageId)
      }
    return result
    } catch (error) {
      throw error
    }
  }
  
  async checkStoreValidation(payload:Payload){
    return await this.storeRepository.existsBy({
      seller:{
        id:payload.userRoleId
      }
    })
  }

  async findOneByPayload(payload:Payload){
    if (payload.role != UserRole.SELLER){
      throw new ForbiddenException(exceptionMessage(ExceptionType.FORBIDDEN,'Access'))
    }
    return await this.findBySellerId(payload.userRoleId)
  }

  async findBySellerId(id:number){
    return await this.storeRepository.findOne({
      where:{
        seller:{
          id:id
        }
      },
    })
  }

  async findAll() {
    return this.storeRepository.find({
      relations:[
        'seller'
      ]
    });
  }

  async findOne(id: number) {
    return await this.storeRepository.findOne({
      where:{
        id
      },
      relations:[
        'seller',
        'products.images',
        'products.types.items',
        'products.category'
      ]
    })
  }

   async remove(userRoleId:number) {
      const store = await this.storeRepository.softDelete({seller:{
        id:userRoleId
      }})
      if(store.affected! <= 0){
        throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"Delete the data"))
      }
      return true;
  }

  async permanentDelete(id:number,payload:Payload){
      const condition = payload.role == UserRole.ADMIN
      const tempRoleId = condition ? undefined : payload.userRoleId
      const store = await this.storeRepository.findOne({
        where:{
            id:id,seller:{
            id:tempRoleId
            }
        },
        withDeleted:true
      })
      if (!store){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Store"))
      }
      
      await this.storeRepository.delete({id:store?.id})
      if (store.image_id){
        await this.imageService.removeImage(store.image_id)
      }
      return true
  }
}
