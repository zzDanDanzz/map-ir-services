import {
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  CardBody,
  Text,
  Portal,
  Spinner,
  Center,
  CloseButton,
  Stack,
  StackDivider,
  HStack,
  Spacer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  CardFooter,
  Badge,
} from '@chakra-ui/react';
import useSWR from 'swr';

import Mapir from 'utils/mapir';

import type { LngLatLike } from 'maplibre-gl';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { mapState } from 'atoms/map';
import useMarker from 'hooks/map/useMarker';

import { activeToolState, routingLocationsState } from 'atoms/global';

import useSelectLocationOnMap from 'hooks/map/useSelectLocationOnMap';
import routeText, { humanReadableInterval } from 'utils/mapir/route-text';
import { toFaDigits } from 'utils';

const mapAPI = new Mapir();

interface IProps {
  onClose?: () => void;
  width: string;
}

export default function Route({ width, onClose }: IProps) {
  const [map] = useAtom(mapState);
  const [activeTool, setActiveTool] = useAtom(activeToolState);
  const [routingLocations, setRoutingLocations] = useAtom(
    routingLocationsState
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  useEffect(() => {
    if (activeTool === 'route') setIsSelectingLocation(true);
    else setIsSelectingLocation(false);

    return () => {
      setRoutingLocations(undefined);
    };
  }, [activeTool]);

  useSelectLocationOnMap({
    map,
    isSelectingLocation,
    changeCursor: true,
    onSelect(location) {
      setRoutingLocations([location]);
      setIsSelectingLocation(false);
    },
    onCancel() {
      setActiveTool(undefined);
    },
  });

  useSelectLocationOnMap({
    map,
    isSelectingLocation: routingLocations?.length === 1,
    changeCursor: true,
    onSelect(location) {
      setRoutingLocations((c) => {
        return [...(c as [LngLatLike]), location];
      });
      setIsSelectingLocation(false);
      setIsVisible(true);
    },
    onCancel() {
      setActiveTool(undefined);
      /// TODO: should do nothing?
    },
  });

  const {
    data: routeData,
    isLoading,
    isValidating,
  } = useSWR(
    (routingLocations?.length ?? 0) === 2
      ? ['route', routingLocations as [LngLatLike, LngLatLike]]
      : null,
    ([, locations]) => mapAPI.route(locations),
    {
      revalidateOnFocus: false,
    }
  );

  useMarker({
    position: routingLocations?.[0],
    color: 'green',
  });

  useMarker({
    position: routingLocations?.[1],
    color: 'red',
  });

  function changeRoute() {
    setRoutingLocations(undefined);
    setIsSelectingLocation(true);
  }

  function closeCard() {
    setIsVisible(false);
    setRoutingLocations(undefined);
  }

  if (!isVisible) return null;

  return (
    // <Portal>
    //   <Card
    //     size="sm"
    //     maxH="sm"
    //     overflow="auto"
    //     shadow="dark-lg"
    //     sx={{
    //       position: 'absolute',
    //       bottom: '1em',
    //       left: '1em',
    //     }}
    //   >
    <Stack
      width={width}
      h="full"
      p={2}
      overflow="auto"
      divider={<StackDivider borderColor="gray.200" />}
    >
      {isLoading ? (
        <Center p={10}>
          <Spinner />
        </Center>
      ) : routeData ? (
        <Stack pt="6">
          {/* <CardHeader>
            <CloseButton
              sx={{
                position: 'absolute',
                top: '1em',
                left: '1em',
              }}
              onClick={closeCard}
            /> */}
          <Stack>
            <Heading size="md">مسیریابی</Heading>
            <HStack>
              <Box>
                {routeData?.waypoints[0].name && (
                  <>
                    از{' '}
                    <Text as="span" color="green.600">
                      {routeData?.waypoints[0].name}
                    </Text>{' '}
                  </>
                )}
                {routeData?.waypoints[1].name && (
                  <>
                    به{' '}
                    <Text as="span" color="red.600">
                      {routeData?.waypoints[1].name}
                    </Text>
                  </>
                )}
              </Box>
              <Spacer />
              <Button size="sm" onClick={changeRoute}>
                ویرایش
              </Button>
            </HStack>
          </Stack>
          {/* </CardHeader> */}

          {/* <CardBody> */}
          {isValidating ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <Tabs colorScheme="green">
              <TabList>
                {routeData?.routes.map((route, idx) => (
                  <Tab fontWeight="bold">
                    مسیر {toFaDigits(idx + 1)}{' '}
                    <Badge
                      colorScheme="green"
                      marginInlineStart={2}
                      fontWeight="normal"
                    >
                      {toFaDigits(
                        humanReadableInterval(route.duration, 'minutes')
                      )}
                    </Badge>
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {routeData?.routes.map((route) => (
                  <TabPanel>
                    {route.legs.map((leg) => (
                      <Stack
                        spacing={2}
                        divider={<StackDivider borderColor="gray.200" />}
                      >
                        {routeText(leg.steps).map(
                          ({ instructionText, durationText }) => (
                            <HStack justify="space-between" bg="gray.50" p={2}>
                              <Text>{instructionText}</Text>
                              {durationText && (
                                <Text fontSize="sm" color="gray.500">
                                  {durationText}
                                </Text>
                              )}
                            </HStack>
                          )
                        )}
                      </Stack>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          )}
          {/* </CardBody> */}

          {/* <CardFooter
              justify="space-between"
              flexWrap="wrap"
              sx={{
                '& > button': {
                  minW: '136px',
                },
              }}
            >
            </CardFooter> */}
        </Stack>
      ) : null}
    </Stack>
  );
}
