import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly httpService:HttpService
  ) {}

  calculateDistance(
    startLat:number,
    startLng:number,
    endLat:number,
    endLng:number
  ){
    const earthRadiusKm = 6371
    const dLat = this.toRadians(endLat - startLat)
    const dLon = this.toRadians(endLng - startLng)

    const lat1Rad = this.toRadians(startLat)
    const lat2Rad = this.toRadians(endLat)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad)

    const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1 - a))

    // Pakai route asli lama jir (wajar gratis, referensi buat project nanti kedepan pakai api gugel asli), mana bisa timeoue, mending hardcode pakai haversine formula (garis lurus)
    // const url =  `https://router.project-osrm.org/route/v1/driving/` + `${startLng},${startLat};${endLng},${endLat}` +`?overview=false`;
    // const response = await this.httpService.axiosRef.get(url)
    // if(
    //   !response.data.routes ||
    //   response.data.routes.length === 0
    // ){
    //   throw new Error("Route not found")
    // }

    // const route = response.data.routes[0]
    // const distanceMeters = route.distance
    // const distanceKm = Number(
    //   (distanceMeters / 1000).toFixed(2)
    // )
    const distanceKm = earthRadiusKm * c
    const distanceMeters = distanceKm * 1000
    return {
      distanceKm:distanceKm,
      distanceMeter:distanceMeters
    }
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
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
