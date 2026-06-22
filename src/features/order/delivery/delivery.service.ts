import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly httpService:HttpService
  ) {}
  async calculateDistance(
    startLat:number,
    startLng:number,
    endLat:number,
    endLng:number
  ){
    const url =  `https://router.project-osrm.org/route/v1/driving/` + `${startLng},${startLat};${endLng},${endLat}` +`?overview=false`;
    const response = await this.httpService.axiosRef.get(url)
    if(
      !response.data.routes ||
      response.data.routes.length === 0
    ){
      throw new Error("Route not found")
    }

    const route = response.data.routes[0]
    const distanceMeters = route.distance
    const distanceKm = Number(
      (distanceMeters / 1000).toFixed(2)
    )

    return {
      distanceKm:distanceKm,
      distanceMeter:distanceMeters
    }
  }
  findAll() {
    return `This action returns all delivery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
