import { atom } from 'jotai';

import type { Map, StyleSpecification, LayerSpecification } from 'maplibre-gl';

export const mapState = atom<Map | undefined>(undefined);
export const mapStyleState = atom<string>('dove');
export const isMapLoadedState = atom<boolean>(false);
export const styleURLState = atom<string>('');
