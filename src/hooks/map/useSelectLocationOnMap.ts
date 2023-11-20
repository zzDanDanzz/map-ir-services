import { useState, useEffect, useCallback } from 'react';

import type { Map, LngLatLike, MapMouseEvent } from 'maplibre-gl';

import IconGeocodeCursorLight from 'assets/images/icons/geocode-cursor-light.svg';
import useEventListener from '../useEventListener';
// import IconGeocodeCursorDark from 'assets/images/icons/geocode-cursor-dark.svg';

interface IUseSelectLocationOnMapProps {
  map?: Map;
  isSelectingLocation?: boolean;
  changeCursor?: boolean;
  onSelect?: (lngLat: LngLatLike) => void;
  onCancel?: () => void;
}
// type IUseSelectLocationOnMapReturn = [LngLatLike | null, () => void, boolean];

const useSelectLocationOnMap = (opt?: IUseSelectLocationOnMapProps) => {
  const {
    map,
    isSelectingLocation = false,
    changeCursor = false,
    onSelect,
    onCancel,
  } = opt ?? {};

  const [selectedLocation, setSelectedLocation] = useState<LngLatLike | null>(
    null
  );

  /// Cancel on `esc` press
  useEventListener(
    'keyup',
    (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onCancel?.();
        afterClick();
      }
    },
    { when: !selectedLocation ? isSelectingLocation : false },
    undefined, /// use body
    true
  );

  const clear = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const afterClick = useCallback(() => {
    if (map && changeCursor) map.getCanvas().style.cursor = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const callback = useCallback(
    (e: MapMouseEvent) => {
      afterClick();
      const location: LngLatLike = [e.lngLat.lng, e.lngLat.lat];
      setSelectedLocation(location);
      onSelect?.(location);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [afterClick]
  );

  useEffect(() => {
    if (!map) return;
    if (!isSelectingLocation) map.off('click', callback);
    if (isSelectingLocation) {
      if (changeCursor) {
        // change Cursor to a marker-like shape
        const iconPath =
          // prefersColorScheme === 'light'
          //   ? IconGeocodeCursorLight
          //   :
          IconGeocodeCursorLight;
        map.getCanvas().style.cursor = `url(${iconPath}) 8 30, wait`;
      }

      map.once('click', callback);

      return () => {
        map.off('click', callback);
      };
    }

    // return () => {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isSelectingLocation]);

  return { selectedLocation, clear };
};

export default useSelectLocationOnMap;
