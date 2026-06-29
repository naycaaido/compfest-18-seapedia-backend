import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { log } from 'console';
import { File } from '../image/constant';
import { ImageService } from '../image/image.service';
import { DirType, Payload } from 'src/common/utils';
import path from 'path';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { UserRole } from '../user/entities/role_user.enum';
import { GeocodingService } from './geocode.service';
import { Province, City, District, Village, Region } from './entities/region.entity';

@Injectable()
export class StoreService {

  constructor(
    @InjectRepository(Store)
    private storeRepository:Repository<Store>,
    private readonly imageService:ImageService,
    private readonly geocodeService:GeocodingService,
    
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,

    @InjectRepository(City)
    private cityRepository: Repository<City>,

    @InjectRepository(District)
    private districtRepository: Repository<District>,

    @InjectRepository(Village)
    private villageRepository: Repository<Village>,
  ) {}

  async create(sellerId:number,createStoreDto: CreateStoreDto,file:File|null) {
    let image_url:string | undefined = undefined

    if (file){
      image_url = this.imageService.makeFileName(file.fileName)
    }
  
    try {
      const addressGeocode = this.geocodeService.processToAddress(createStoreDto.province,createStoreDto.city,createStoreDto.village)
      const location = await this.proccesGeocode(createStoreDto.province!, createStoreDto.city!, createStoreDto.village!)

      const province = await this.findOrCreateRegion(
        this.provinceRepository,
        createStoreDto.province_id,
        createStoreDto.province,
      );

      const city = await this.findOrCreateRegion(
        this.cityRepository,
        createStoreDto.city_id,
        createStoreDto.city,
      );

      const district = await this.findOrCreateRegion(
        this.districtRepository,
        createStoreDto.district_id,
        createStoreDto.district,
      );

      const village = await this.findOrCreateRegion(
        this.villageRepository,
        createStoreDto.village_id,
        createStoreDto.village,
      );

      const store = this.storeRepository.create({
        ...createStoreDto,
        address:`${createStoreDto.address}, ${createStoreDto.district}, ${addressGeocode}`,
        latitude:location.latitude,
        longitude:location.longitude,
        image_id: image_url ? path.join(DirType.STORE, image_url) : undefined,
        province,
        city,
        district,
        village,
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
          seller:true,
          province:true,
          city:true,
          district:true,
          village:true
        }
      })

      log("Update",updateStoreDto)
      if(!store){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,'Please Create Store first'))
      }
      let province = store.province
      let city = store.city
      let district = store.district
      let village = store.village
      let address = store.address;
      const regionChanged =
      updateStoreDto.province_id != province.id ||
      updateStoreDto.city_id != city.id ||
      updateStoreDto.district_id != district.id ||
      updateStoreDto.village_id != village.id;

      if(regionChanged && updateStoreDto.province_id && updateStoreDto.city_id && updateStoreDto.district_id && updateStoreDto.village_id){
        province = await this.findOrCreateRegion(
            this.provinceRepository,
          updateStoreDto.province_id!,
          updateStoreDto.province!,
        );

        city = await this.findOrCreateRegion(
            this.cityRepository,
          updateStoreDto.city_id!,
          updateStoreDto.city!,
        );

        district = await this.findOrCreateRegion(
            this.districtRepository,
          updateStoreDto.district_id!,
          updateStoreDto.district!,
        );

        village = await this.findOrCreateRegion(
            this.villageRepository,
          updateStoreDto.village_id!,
          updateStoreDto.village!,
        );
        
        const addressGeocode = this.geocodeService.processToAddress(updateStoreDto.province!,updateStoreDto.city!,updateStoreDto.village!)
        const location = await this.proccesGeocode(updateStoreDto.province!, updateStoreDto.city!, updateStoreDto.village!)
        store.latitude = location.latitude
        store.longitude = location.longitude
        address = `${updateStoreDto.address ?? address}, ${updateStoreDto.district}, ${addressGeocode}`;
      }

      const storeCreated = this.storeRepository.create({
        ...updateStoreDto,
        image_id: image_url ? path.join(DirType.STORE, image_url) : undefined,
        address: address,
        province: province,
        city:city,
        district:district,
        village:village
      })

      const oldImageId = store.image_id

      const updatedStore = this.storeRepository.merge(store,storeCreated)
      log("Latest Updated",updateStoreDto)
      
      const result = await this.storeRepository.save(updatedStore)
      if (file){
        await this.imageService.writeImage(file,image_url!,DirType.STORE)
      }
      if(oldImageId && file){
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
        },
      },
      relations:{
        province:true,
        city:true,
        district:true,
        village:true,
      }
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

  private async proccesGeocode(province:string, city:string, village:string){
    const location = await this.geocodeService.geocode(province,city,village)
      if (!location) {
        throw new BadRequestException(exceptionMessage(ExceptionType.BAD_REQUEST,'Address could not be located'));
    }
    return location
  }

  private async findOrCreateRegion<T extends Region>(
    repository: Repository<T>,
    id: number,
    name: string,
  ): Promise<T> {
    let region = await repository.findOneBy({
      id,
    } as FindOptionsWhere<T>);

    if (!region) {
      region = repository.create({
        id,
        name,
      } as DeepPartial<T>);

      region = await repository.save(region);
    }

    return region;
  }
}
