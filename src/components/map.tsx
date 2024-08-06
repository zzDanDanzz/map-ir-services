import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import maplibre from 'maplibre-gl';
import { useAtom } from 'jotai';

import { contextMenuPositionState, activeToolState } from 'atoms/global';
import { mapState, isMapLoadedState, mapStyleState } from 'atoms/map';

import urls from 'configs/urls';

import 'maplibre-gl/dist/maplibre-gl.css';

import defaultStylePreviewImageSrc from 'assets/images/styles-preview/default.webp';
import lightStylePreviewImageSrc from 'assets/images/styles-preview/light.webp';
import darkStylePreviewImageSrc from 'assets/images/styles-preview/dark.webp';
import minPoiStylePreviewImageSrc from 'assets/images/styles-preview/min-poi.webp';
import doveStylePreviewImageSrc from 'assets/images/styles-preview/dove.webp';
import {
  generateMapStyle,
  IMapStyle,
  mapStylesSources,
} from 'utils/map-styles';

if (maplibre.getRTLTextPluginStatus() === 'unavailable')
  maplibre.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
    (err) => {
      if (err) console.error(err);
    },
    true
  );

interface IProps {
  // options: MapOptions;
}

export default function Map({}: IProps) {
  const [map, setMap] = useAtom(mapState);
  const [mapStyle] = useAtom(mapStyleState);
  const [, setIsMapLoaded] = useAtom(isMapLoadedState);
  const [, setContextMenuPosition] = useAtom(contextMenuPositionState);
  const [activeTool] = useAtom(activeToolState);
  // const styleObj = useAtomValue(styleObjState);

  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapIsMountedRef = useRef(false);

  // initialize the map
  useEffect(() => {
    if (mapIsMountedRef.current) return;

    console.log('mapp');

    const futureMap = new maplibre.Map({
      container: mapElRef.current || '',
      style: 'https://map.ir/vector/styles/main/mapir-Dove-style.json',
      center: [54.82, 31.77],
      zoom: 5,
      pitch: 0,
      hash: true,
      attributionControl: true,
      customAttribution: '© Map.ir © Openstreetmap',
      trackResize: true,
      transformRequest: (url: string) => {
        return {
          url,
          headers: {
            'x-api-key':
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBkZTBjZTQ5Njg2MTMwOTc0YWU2NDhkOGMwZjU5NWRhYzFlMTVhZTMzZDg1ODk1NTk2NDQwMjA4MmU3MjMzNTM5MTAyNGM5OGJmY2M3ZDU1In0.eyJhdWQiOiI5NTgxIiwianRpIjoiMGRlMGNlNDk2ODYxMzA5NzRhZTY0OGQ4YzBmNTk1ZGFjMWUxNWFlMzNkODU4OTU1OTY0NDAyMDgyZTcyMzM1MzkxMDI0Yzk4YmZjYzdkNTUiLCJpYXQiOjE1OTIyMDEyNTcsIm5iZiI6MTU5MjIwMTI1NywiZXhwIjoxNTk0NDQ3NjU3LCJzdWIiOiIiLCJzY29wZXMiOlsiYmFzaWMiXX0.eG2UAq4zVsdnYkW7IMrJWWdXuxtT_EAVY-XiPPzgWJtMtG8vDnnsLQsajdgej1_u0bWzrZvdk2AzpQoABct9etvHTUbK8wBZn6CM7mzu3Uy5KzsR-0zbyDc0vqpfMcZekwXqgze6w8p8INlL4-ImpINrRstRDqsJWFsA2REnwUG-UUPRh6Sjz_lVbow4q975pI6ogt6P8nkcXXaJjmI3KCGXj-xtvvbnZiViUIw4Y12UDCNWb3ykzVfjVUnOcZ-Zbxi8591OZu_VKGfgt5VuNnNbUz654BQzpiiNdTcFhJdUTKsEvMJut0kU0YSX7EUwS50h_5EF32kR3abyJh7nIg',
          },
        };
      },
    });

    mapIsMountedRef.current = true;

    futureMap.on('load', () => {
      futureMap.resize();
      setIsMapLoaded(true);
    });

    futureMap.on('contextmenu', function (e) {
      setContextMenuPosition(e);
    });

    setMap?.(futureMap);
  }, []);

  useEffect(() => {
    if (!map) return;
    const styleSrc = mapStylesSources.find(
      ({ source }) => source === mapStyle.source
    );
    if (!styleSrc)
      console.assert(false, {
        message: `style id specified (${mapStyle}) is not valid`,
      });
    else {
      map.setStyle(generateMapStyle(styleSrc as IMapStyle) as any);
    }
  }, [mapStyle]);

  useEffect(() => {
    /// TODO: Did this caused any issues?
    map?.resize();
  }, [activeTool]);

  // Show the layers on Map
  // useEffect(() => {
  //   if (map && isMapLoaded && styleObj) {
  //     const srcName = Object.keys(styleObj.sources)[0];
  //     const srcData = styleObj.sources[Object.keys(styleObj.sources)[0]];
  //     const layersStyle = styleObj.layers;
  //     if (!map.getSource(srcName)) {
  //       map.addSource(srcName, srcData);
  //     }
  //     for (const layerStyle of layersStyle) {
  //       if (!map.getLayer(layerStyle.id)) {
  //         try {
  //           map.addLayer(layerStyle);
  //         } catch (err) {
  //           console.error(err);
  //         }
  //       }
  //     }
  //   }
  // }, [map, isMapLoaded, styleObj]);

  return (
    <Box
      w="full"
      h="full"
      position="relative"
      overflow="hidden"
      borderRadius={2}
      bg="gray.100"
    >
      <Box w="full" h="full" id="map" ref={mapElRef}></Box>
    </Box>
  );
}
