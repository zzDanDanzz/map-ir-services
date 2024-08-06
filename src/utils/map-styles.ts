import { Base, googleProxyBase } from 'configs/global';

import mapirRasterImage from 'assets/images/map-styles/mapir-raster.png';
import googleSatelliteImage from 'assets/images/map-styles/google-satellite.png';
import googleSatelliteLabelImage from 'assets/images/map-styles/google-satellite-label.png';
import googleTerrainLabelImage from 'assets/images/map-styles/google-terrain-label.png';
import googleTerrainTrafficLabelImage from 'assets/images/map-styles/google-terrain-traffic-label.png';
import mapirXyzStyleImage from 'assets/images/map-styles/mapir-xyz-light-style.png';
import mapirStyleDarkImage from 'assets/images/map-styles/mapir-style-dark.png';
import mapirXyzLightStyleImage from 'assets/images/map-styles/mapir-xyz-light-style.png';
import mapirDoveStyleImage from 'assets/images/map-styles/mapir-Dove-style.png';
import mapirFrankStyleImage from 'assets/images/map-styles/mapir-frank-style.png';

export type RasterSourceIDs =
  | 'mapir-raster'
  | 'google-satellite'
  | 'google-satellite-label'
  | 'google-terrain-label'
  | 'google-terrain-traffic-label';
//  | 'osm-raster';

export type VectorSourceIDs =
  | 'mapir-xyz-style'
  | 'mapir-style-dark'
  | 'mapir-xyz-light-style'
  | 'mapir-Dove-style'
  | 'mapir-frank-style';

type SourceIDs = VectorSourceIDs | RasterSourceIDs;

export type IMapStyle =
  | { type: 'vector'; source: VectorSourceIDs }
  | { type: 'raster'; source: RasterSourceIDs };

export const generateMapStyle = ({ type, source }: IMapStyle) => {
  if (type === 'vector') {
    return `${Base}/vector/styles/main/${source}.json`;
  }

  return generateMapstyleForRaster(source);
};

export const styleThumbnails: Record<SourceIDs, string> = {
  'mapir-raster': mapirRasterImage,
  'google-satellite': googleSatelliteImage,
  'google-satellite-label': googleSatelliteLabelImage,
  'google-terrain-label': googleTerrainLabelImage,
  'google-terrain-traffic-label': googleTerrainTrafficLabelImage,
  'mapir-xyz-style': mapirXyzStyleImage,
  'mapir-style-dark': mapirStyleDarkImage,
  'mapir-xyz-light-style': mapirXyzLightStyleImage,
  'mapir-Dove-style': mapirDoveStyleImage,
  'mapir-frank-style': mapirFrankStyleImage,
};

export const styleNames: Record<SourceIDs, string> = {
  'mapir-raster': 'مپ',
  'google-satellite': 'ماهواره‌ای گوگل',
  'google-satellite-label': 'ماهواره گوگل با برچسب',
  'google-terrain-label': 'ارتفاعی گوگل با برچسب',
  'google-terrain-traffic-label': 'ارتفاعی گوگل با برچسب و ترافیک',
  'mapir-xyz-style': 'گنجشک',
  'mapir-style-dark': 'کلاغ',
  'mapir-xyz-light-style': 'پرستو',
  'mapir-Dove-style': 'کبوتر',
  'mapir-frank-style': 'شاهین',
};

export type MapStyleTypes = 'vector' | 'raster';

export const mapStylesSources: { source: SourceIDs; type: MapStyleTypes }[] = [
  {
    source: 'mapir-xyz-style',
    type: 'vector',
  },
  {
    source: 'mapir-style-dark',
    type: 'vector',
  },
  {
    source: 'mapir-xyz-light-style',
    type: 'vector',
  },
  {
    source: 'mapir-Dove-style',
    type: 'vector',
  },
  {
    source: 'mapir-frank-style',
    type: 'vector',
  },
  {
    source: 'mapir-raster',
    type: 'raster',
  },
  {
    source: 'google-satellite',
    type: 'raster',
  },
  {
    source: 'google-satellite-label',
    type: 'raster',
  },
  {
    source: 'google-terrain-label',
    type: 'raster',
  },
  {
    source: 'google-terrain-traffic-label',
    type: 'raster',
  },
  // {
  //   source: 'osm-raster',
  //   type: 'raster',
  // },
];

const generateMapstyleForRaster = (rasterID: RasterSourceIDs) => {
  return {
    version: 8,
    sprite: `${Base}/vector/styles/main/sprite`,
    glyphs: `${Base}/vector/styles/main/glyphs/{fontstack}/{range}.pbf`,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: [getRasterTileUrlFromSource(rasterID)],
        tileSize: 256,
        attribution: '',
      },
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
};

const getRasterTileUrlFromSource = (source: string) =>
  source === 'mapir-raster'
    ? `${Base}/shiveh/xyz/1.0.0/Shiveh:Shiveh@EPSG:3857@png/{z}/{x}/{y}.png`
    : source === 'google-satellite'
      ? `${googleProxyBase}/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}`
      : source === 'google-satellite-label'
        ? `${googleProxyBase}/vt/lyrs=y&hl=fa&x={x}&y={y}&z={z}`
        : source === 'google-terrain-label'
          ? `${googleProxyBase}/vt/lyrs=p&hl=fa&x={x}&y={y}&z={z}`
          : source === 'google-terrain-traffic-label'
            ? `${googleProxyBase}/vt/lyrs=p,traffic&hl=fa&x={x}&y={y}&z={z}`
            : source === 'osm-raster'
              ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              : `${Base}/shiveh/xyz/1.0.0/Shiveh:Shiveh@EPSG:3857@png/{z}/{x}/{y}.png`;
