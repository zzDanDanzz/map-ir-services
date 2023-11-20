import { useCallback, useContext, useEffect, useState } from 'react';

import type { Map, MapLibreZoomEvent } from 'maplibre-gl';

interface IParams {
  map?: Map;
}

export default function useZoom({ map }: IParams) {
  const [zoom, setZoom] = useState(map?.getZoom() ?? 10);

  useEffect(() => {
    if (!map) return;

    function onZoom(e: MapLibreZoomEvent) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const zoom = map!.getZoom();
      if (zoom) setZoom(zoom);
    }

    map.on('zoomend', onZoom);

    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map]);

  const zoomTo = useCallback(
    (z: number) => {
      map?.zoomTo(z, { duration: 500 });
    },
    [map]
  );

  useEffect(() => {
    zoomTo(zoom);
  }, [zoom]);

  return {
    zoom,
    minZoom: map?.getMinZoom(),
    maxZoom: map?.getMaxZoom(),
    setZoom,
  } as const;
}
