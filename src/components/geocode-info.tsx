import {
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  CardBody,
  CardFooter,
  Text,
  Image,
  Portal,
  Breadcrumb,
  BreadcrumbItem,
  Spinner,
  Center,
  CloseButton,
  Stack,
  Button,
} from '@chakra-ui/react';
import useSWR from 'swr';

import Mapir from 'utils/mapir';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { mapState } from 'atoms/map';
import useMarker from 'hooks/map/useMarker';
import { activeToolState, selectedLocationOnMapState } from 'atoms/global';
import useSelectLocationOnMap from 'hooks/map/useSelectLocationOnMap';
import useZoom from 'hooks/map/useZoom';

const mapAPI = new Mapir();

interface IProps {
  onClose?: () => void;
}

export default function GeocodeInfo({ onClose }: IProps) {
  const [map] = useAtom(mapState);
  const [activeTool] = useAtom(activeToolState);
  const [selectedLocationOnMap, setSelectedLocationOnMap] = useAtom(
    selectedLocationOnMapState
  );

  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>();

  const { zoom } = useZoom({ map });

  const {
    data: reverseData,
    isLoading: reverseIsLoading,
    isValidating: reverseIsValidating,
  } = useSWR(
    selectedLocationOnMap ? ['reverse-geocode', selectedLocationOnMap] : null,
    ([, location]) => mapAPI.reverseGeocode(location),
    {
      revalidateOnFocus: false,
    }
  );

  const {
    data: staticMapData,
    isLoading: staticMapIsLoading,
    isValidating: staticMapIsValidating,
  } = useSWR(
    selectedLocationOnMap ? ['static-map', selectedLocationOnMap, zoom] : null,
    ([, location, zoom]) =>
      mapAPI.staticMap([location], {
        zoom: Math.floor(zoom),
      }),
    {
      revalidateOnFocus: false,
    }
  );

  useSelectLocationOnMap({
    map,
    isSelectingLocation,
    changeCursor: true,
    onSelect(location) {
      setSelectedLocationOnMap(location);
      // toast.dismiss('selectLocationToast');
    },
    onCancel() {
      // toast.dismiss('selectLocationToast');
    },
  });

  useMarker({
    position: selectedLocationOnMap,
  });

  useEffect(() => {
    if (activeTool === 'reverse-geocode') setIsSelectingLocation(true);
    else setIsSelectingLocation(false);
  }, [activeTool]);

  useEffect(() => {
    if (!staticMapData) return;

    const blobSrc = window.URL.createObjectURL(staticMapData);
    setImgSrc(blobSrc);

    return () => {
      window.URL.revokeObjectURL(blobSrc);
    };
  }, [staticMapData]);

  function closeCard() {
    setSelectedLocationOnMap(undefined);
  }

  if (!selectedLocationOnMap) return null;

  return (
    <Portal>
      <Card
        maxW="sm"
        overflow="hidden"
        shadow="dark-lg"
        sx={{
          position: 'absolute',
          bottom: '1em',
          left: '1em',
        }}
      >
        {reverseIsLoading ? (
          <Center p={10}>
            <Spinner />
          </Center>
        ) : (
          <>
            <CloseButton
              sx={{
                position: 'absolute',
                top: '1em',
                left: '1em',
              }}
              onClick={closeCard}
            />

            <Center>
              {staticMapIsLoading ? (
                <Center p={4}>
                  <Spinner />
                </Center>
              ) : (
                <Image
                  objectFit="cover"
                  src={imgSrc}
                  alt="static map"
                  fallbackSrc={`https://via.placeholder.com/${500}`}
                />
              )}
            </Center>

            <CardHeader>
              <Stack>
                <Heading size="sm">{reverseData?.last}</Heading>
                <Text>{reverseData?.region}</Text>
              </Stack>
            </CardHeader>

            <CardBody py={0}>
              {reverseIsLoading ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                <Text>{reverseData?.address_compact}</Text>
              )}
            </CardBody>

            <CardFooter
              justify="space-between"
              flexWrap="wrap"
              sx={{
                '& > button': {
                  minW: '136px',
                },
              }}
            >
              {reverseData && (
                <Breadcrumb fontSize="x-small" color="gray.500">
                  <BreadcrumbItem>
                    <Text as="span">{reverseData?.country}</Text>
                  </BreadcrumbItem>

                  <BreadcrumbItem>
                    <Text as="span">{reverseData?.county}</Text>
                  </BreadcrumbItem>

                  <BreadcrumbItem isCurrentPage>
                    <Text as="span">{reverseData?.city}</Text>
                  </BreadcrumbItem>
                </Breadcrumb>
              )}

              {/* <Button flex="1" variant="ghost">
                اشتراک‌گذاری
              </Button> */}
            </CardFooter>
          </>
        )}
      </Card>
    </Portal>
  );
}
