import { atom } from 'jotai';

import type { LngLatLike, MapMouseEvent } from 'maplibre-gl';
import type { Tool } from 'types/global';

export const activeToolState = atom<Tool | undefined>(undefined);
export const isSelectingLocationState = atom(false);

interface IPoint {
  x: number;
  y: number;
}
export const contextMenuPositionState = atom<MapMouseEvent | undefined>(
  undefined
);

export const selectedLocationOnMapState = atom<LngLatLike | undefined>(
  undefined
);

export const userLocationState = atom<LngLatLike | undefined>(undefined);
export const geoLocationStatusState = atom<
  'success' | 'loading' | 'failed' | 'not-supported' | undefined
>(undefined);

export const routingLocationsState = atom<
  [LngLatLike] | [LngLatLike, LngLatLike] | undefined
>(undefined);
