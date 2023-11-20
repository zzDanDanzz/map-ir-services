import type { Point } from 'geojson';
import { LngLat, LngLatLike } from 'maplibre-gl';
import { qs } from 'utils';

import route from './route';

const { PUBLIC_API_KEY: APIKey } = import.meta.env;

export default class Mapir {
  apiKey: string =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY0NGNlZWQ3MjNkZDNmZTE0ZDRlYzhlYjY0YjVmMjc2YjAwM2NlZmQ1OTFkMGNjNmEyOWVhMTI3Nzc3NWMwZDNiNDJkYTFlZmNmZDFlZWVlIn0.eyJhdWQiOiI2OTQ1IiwianRpIjoiZjQ0Y2VlZDcyM2RkM2ZlMTRkNGVjOGViNjRiNWYyNzZiMDAzY2VmZDU5MWQwY2M2YTI5ZWExMjc3Nzc1YzBkM2I0MmRhMWVmY2ZkMWVlZWUiLCJpYXQiOjE1ODQ5ODQwOTYsIm5iZiI6MTU4NDk4NDA5NiwiZXhwIjoxNTg2MzY2NDk2LCJzdWIiOiIiLCJzY29wZXMiOlsiYmFzaWMiXX0.oiJxIJIKQ0Z9QgoE3c6MwxvdBLcfUu_-Y2MK5581PhZ5r23L5xkVIvGVpuHyNjJqx4iUpNWXH_qZ68Z5X2c4cviZ-fLuc8wMdNsJAH6F2X0s9fJXVZVwdZhVOpdsgEFB_AE-zhY8FoRGAqLcJqBWUefh7jviQvB_0v_Z-yC8-c8ve95XxS7xQvZLMN3Ca4TTCqXdgLi7KpbAN0i-nTX7xr8Vb3oes92_ZiB9AWnxS8YRKGC7_EIEdkPdqyFhjEu-Lp09ZJ--UxQMjwDPSfX0pTANUd33tMcZ-du4fqM1oiTlZKIJ3g5S2fKGSpDo_5CP_n9zi0lp6eg3NHA--fDDfA' ??
    APIKey ??
    '';
  baseURL?: string = 'https://map.ir';

  constructor(opt?: IConstructorOptions) {
    const { apiKey, baseURL } = opt ?? {};
    if (apiKey) this.apiKey = apiKey;
    if (baseURL) this.baseURL = baseURL;
  }

  search(text: string, location: LngLat, autocomplete?: boolean) {
    const url = new URL(
      `/search${autocomplete ? '/autocomplete' : ''}`,
      this.baseURL
    );

    return fetch(url, {
      method: 'POST' as SearchMethod,
      headers: {
        'x-api-key': this.apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        text,
        returnid: true,
        location: {
          type: 'Point',
          coordinates: [location.lng, location.lat],
        },
      } as ISearchPayload),
    })
      .then((res) => res.json())
      .then((res) => res as ISearchResult | undefined);
  }

  reverseGeocode(location: LngLatLike) {
    const lngLat = LngLat.convert(location);
    const q = qs({
      lat: lngLat.lat.toString(),
      lon: lngLat.lng.toString(),
    } as IReversePayload);
    const url = new URL(`/reverse?${q}`, this.baseURL);

    return fetch(url, {
      method: 'GET' as ReverseMethod,
      headers: {
        'x-api-key': this.apiKey,
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => res as IReverseResult | undefined);
  }

  public route = route;

  staticMap(
    location: [LngLatLike] | [LngLatLike, LngLatLike],
    options?: IStaticMapOptions
  ) {
    const {
      width = 700,
      height = 500,
      zoom = 13,
      colors = ['red', 'red'],
      labels,
    } = options ?? {};

    const markers = location
      .map((loc, idx) => {
        const lngLat = LngLat.convert(loc);
        return [
          `color:${colors[idx]}`,
          [lngLat.lng, lngLat.lat].join(),
          labels?.[idx],
        ]
          .filter(Boolean)
          .join('|');
      })
      .join();

    const q = qs({
      markers,
      width: String(width),
      height: String(height),
      zoom_level: String(zoom),
    } as IStaticMapPayload);
    const url = new URL(`/static?${q}`, this.baseURL);

    return fetch(url, {
      method: 'GET' as StaticMapMethod,
      headers: {
        'x-api-key': this.apiKey,
      },
    })
      .then((res) => res.blob())
      .then((res) => res as StaticMapResult | undefined);
  }
}

export interface IConstructorOptions {
  apiKey?: string;
  baseURL?: string;
}

//** Search v1  */ */

export type SearchMethod = 'POST';
export interface ISearchPayload {
  location: Point;
  returnid: boolean;
  text: string;
}
export interface ISearchResult {
  'odata.count': number;
  request_id: number;
  value: Array<{
    Address: string;
    City: string;
    Coordinate: { lat: number; lon: number };
    FClass: string;
    Id: string;
    Province: string;
    Text: string;
    Title: string;
    Type: string;
  }>;
}

//** Reverse Geocode  */ */

export type ReverseMethod = 'POST';
export interface IReversePayload extends Record<string, string> {
  lat: `${number}`;
  lon: `${number}`;
}
export interface IReverseResult {
  address: string;
  address_compact: string;
  city: string;
  country: string;
  county: string;
  district: string;
  geom: Point;
  last: string;
  name: string;
  neighbourhood: string;
  penult: string;
  plaque: string;
  poi: string;
  postal_address: string;
  postal_code: string;
  primary: string;
  province: string;
  region: string;
  rural_district: string;
  village: string;
}

//** Static Map  */ */
export interface IStaticMapOptions {
  width?: number | `${number}`;
  height?: number | `${number}`;
  colors?: [string] | [string, string];
  labels?: [string] | [string, string];
  zoom?: number | `${number}`;
}
export type StaticMapMethod = 'GET';
export interface IStaticMapPayload extends Record<string, string> {
  width: `${number}`;
  height: `${number}`;
  markers: `color:${'red' | 'blue'}|${number},${number}|${string}`;
  zoom_level: `${number}`;
}
export type StaticMapResult = Blob;
