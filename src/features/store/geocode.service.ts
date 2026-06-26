import { Injectable } from '@nestjs/common';

@Injectable()
export class GeocodingService {
  async geocode(province: string,city: string,village: string) {
    const params = new URLSearchParams({
      state: province,
      city: city,
      village: village,
      countryCodes: 'id',
      limit: '1',
      format: 'jsonv2',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'User-Agent': 'Seapedia/Shade/1.0',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();

    if (!data.length) {
      return null;
    }

    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    };
  }

  processToAddress(province:string, city:string, district:string){
    return `${district}, ${city}, ${province}`
  }
}