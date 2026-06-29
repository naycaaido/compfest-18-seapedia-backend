import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Payload } from 'src/common/utils';
import { Buyer } from '../buyer/entities/buyer.entity';
import { exceptionMessage, ExceptionType } from 'src/common/exception';
import { Province, City, District, Village, Region } from '../store/entities/region.entity';
import { GeocodingService } from '../store/geocode.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository:Repository<Address>,
    @InjectRepository(Buyer)
    private buyerRepository:Repository<Buyer>,
    
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

  async create(createAddressDto: CreateAddressDto,payload:Payload) {
    try {
      const addressGeocode = this.geocodeService.processToAddress(createAddressDto.province,createAddressDto.city,createAddressDto.village)
      const location = await this.proccesGeocode(createAddressDto.province!, createAddressDto.city!, createAddressDto.village!)
      const province = await this.findOrCreateRegion(
        this.provinceRepository,
        createAddressDto.province_id,
        createAddressDto.province,
      );

      const city = await this.findOrCreateRegion(
        this.cityRepository,
        createAddressDto.city_id,
        createAddressDto.city,
      );

      const district = await this.findOrCreateRegion(
        this.districtRepository,
        createAddressDto.district_id,
        createAddressDto.district,
      );

      const village = await this.findOrCreateRegion(
        this.villageRepository,
        createAddressDto.village_id,
        createAddressDto.village,
      );

      const address = this.addressRepository.create({
        ...createAddressDto,
        address_detail:`${createAddressDto.address_detail}, ${createAddressDto.district}, ${addressGeocode}`,
        latitude:location.latitude,
        longitude:location.longitude,
        province,
        city,
        district,
        village,
        buyer:{
          id:payload.userRoleId
        }
      })
      const addressSaved = await this.addressRepository.save(address) 
      const buyer = await this.findBuyerPayload(payload)
      if(!buyer){
        throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Buyer"))
      }
      if(!buyer.active_address_id){
        buyer.active_address_id = addressSaved.id
        await this.buyerRepository.save(buyer)
      }
      return address;
    } catch (error) {
      throw error
    }
  }

  async update(
  id: number,
  updateAddressDto: UpdateAddressDto,
  payload: Payload,
) {
  const address = await this.addressRepository.findOne({
    where: {
      id,
      buyer: {
        id: payload.userRoleId,
      },
    },
    relations: {
      buyer: true,
      province: true,
      city: true,
      district: true,
      village: true,
    },
  });

  if (!address) {
    throw new NotFoundException(
      exceptionMessage(ExceptionType.NOT_FOUND, "Address"),
    );
  }

  if (updateAddressDto.is_active) {
    const buyer = address.buyer;
    buyer.active_address_id = address.id;
    await this.buyerRepository.save(buyer);
  }

  let province = address.province;
  let city = address.city;
  let district = address.district;
  let village = address.village;

  let latitude = address.latitude;
  let longitude = address.longitude;

  let addressDetail = address.address_detail;

  const regionChanged =
    updateAddressDto.province_id !== province.id ||
    updateAddressDto.city_id !== city.id ||
    updateAddressDto.district_id !== district.id ||
    updateAddressDto.village_id !== village.id;

  if (regionChanged) {
    province = await this.findOrCreateRegion(
      this.provinceRepository,
      updateAddressDto.province_id!!,
      updateAddressDto.province!!,
    );

    city = await this.findOrCreateRegion(
      this.cityRepository,
      updateAddressDto.city_id!!,
      updateAddressDto.city!!,
    );

    district = await this.findOrCreateRegion(
      this.districtRepository,
      updateAddressDto.district_id!!,
      updateAddressDto.district!!,
    );

    village = await this.findOrCreateRegion(
      this.villageRepository,
      updateAddressDto.village_id!!,
      updateAddressDto.village!!,
    );

    const location = await this.proccesGeocode(
      updateAddressDto.province!!,
      updateAddressDto.city!!,
      updateAddressDto.village!!,
    );

    latitude = location.latitude;
    longitude = location.longitude;

    const fullAddress = this.geocodeService.processToAddress(
      updateAddressDto.province!!,
      updateAddressDto.city!!,
      updateAddressDto.village!!,
    );

    addressDetail =
      `${updateAddressDto.address_detail}, ${updateAddressDto.district}, ${fullAddress}`;
  }

  const updatedAddress = this.addressRepository.create({
    ...updateAddressDto,
    address_detail: addressDetail,
    latitude,
    longitude,
    province,
    city,
    district,
    village,
  });

  const merged = this.addressRepository.merge(address, updatedAddress);

  return await this.addressRepository.save(merged);
  }


  async findAll(payload:Payload) {
    return await this.addressRepository.find({
      where:{
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:{
        province:true,
        district:true,
        city:true,
        village:true,
      }
    })
  }

  async findActive(payload:Payload){
    const buyer = await this.findBuyerPayload(payload)
    if(!buyer){
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND,"Buyer"))
    }

    const activeAddressId = buyer?.active_address_id
    if (activeAddressId == null) {
      throw new NotFoundException(
        exceptionMessage(ExceptionType.NOT_FOUND, "Active Address")
      )
    }

    const address = await this.addressRepository.findOneBy({
      id: activeAddressId
    })
    return address
  }

  async findOne(id: number, payload:Payload) {
    return await this.addressRepository.findOne({
      where:{
        id,
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:{
        province:true,
        district:true,
        city:true,
        village:true,
      }
    });
  }

  async remove(id: number,payload:Payload) {
    const address = await this.addressRepository.findOne({
      where:{
        id,
        buyer:{
          id:payload.userRoleId
        }
      },
      relations:{
        buyer:{
          activeAddress:true
        }
      }
    })
    if (!address) {
      throw new NotFoundException(exceptionMessage(ExceptionType.NOT_FOUND, 'Address'));
    }

    if (address.buyer.activeAddress?.id === address.id) {
      await this.buyerRepository.update(
        { id: address.buyer.id },
        {
          active_address_id: null,
        },
      );
    }
        
    const result = await this.addressRepository.delete({id:address.id})
    if(result.affected! <= 0){
      throw new NotFoundException(exceptionMessage(ExceptionType.DEFAULT,"Delete the data"))
    }
    return true
  }

  private async findBuyerPayload(payload:Payload){
    return await this.buyerRepository.findOneBy({
      id:payload.userRoleId
    })
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
