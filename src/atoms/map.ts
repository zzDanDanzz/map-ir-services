import { atom } from 'jotai';

import type { Map, StyleSpecification, LayerSpecification } from 'maplibre-gl';
import { IMapStyle } from 'utils/map-styles';

export const mapState = atom<Map | undefined>(undefined);

export const mapStyleState = atom<IMapStyle>({
  source: 'mapir-xyz-style',
  type: 'vector',
});

export const isMapLoadedState = atom<boolean>(false);
export const styleURLState = atom<string>('');
