import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEventHandler,
  type CSSProperties,
  type ReactNode,
} from 'react';
import ReactDOM, { type Root as ReactDOMRoot } from 'react-dom/client';
import { useAtom } from 'jotai';
import maplibreGl, {
  type Map,
  type LngLatLike,
  type Marker as MarkerType,
} from 'maplibre-gl';

import { mapState } from 'atoms/map';

import { ReactComponent as GeocodeIcon } from 'assets/images/icons/geocode.svg';

interface IParams {
  position?: LngLatLike;
  onRemove?: () => void;
  icon?: ReactNode;
  color?: string;
}

export default function useMarker({
  position,
  icon: Icon,
  color,
  onRemove,
}: IParams) {
  const [map] = useAtom(mapState);

  const ref = useRef<HTMLDivElement>();
  const markerContainer = useRef<ReactDOMRoot>();

  const [marker, setMarker] = useState<MarkerType | null>(null);

  const createMarker = useCallback(() => {
    return new maplibreGl.Marker({
      element: ref.current,
      anchor: 'bottom',
    });
  }, []);

  const removeMarker: MouseEventHandler<HTMLSpanElement> = useCallback(
    (e) => {
      e.stopPropagation();
      onRemove?.();
    },
    [onRemove]
  );

  useEffect(() => {
    ref.current = document.createElement('div');
    ref.current.className = 'marker';
    markerContainer.current = ReactDOM.createRoot(ref.current);
    return () => {
      ref.current?.remove();
      marker?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markerContainer.current?.render(<DefaultMarker color={color} />);
    const marker = createMarker();
    setMarker(marker);

    return () => {
      marker?.remove();
      setMarker(null);
    };
  }, []);

  useEffect(() => {
    if (!map || !ref.current) return;

    if (marker && position) {
      marker.setLngLat(position).addTo(map as Map);
    } else if (!marker && position) {
      const marker = createMarker();
      setMarker(marker);
    } else if (marker) {
      marker?.remove();
      setMarker(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, position, removeMarker, marker]);

  return {};
}

interface IMarkerProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
  color?: string;
}

function DefaultMarker({ className, style, id, color }: IMarkerProps) {
  return <GeocodeIcon color={color ?? '#222'} style={{ fontSize: '3em' }} />;
}
