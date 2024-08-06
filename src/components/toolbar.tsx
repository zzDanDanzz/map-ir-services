import { useAtom } from 'jotai';
import {
  Center,
  HStack,
  IconButton,
  Kbd,
  Tooltip,
  Text,
  Spacer,
  Image,
  AspectRatio,
  Icon,
  StackDivider,
  chakra,
  useToast,
} from '@chakra-ui/react';

import {
  activeToolState,
  geoLocationStatusState,
  userLocationState,
} from 'atoms/global';
import { findMyLocation } from 'utils';

import { mapState } from 'atoms/map';
import { Tool } from 'types/global';

import SearchIcon from '~icons/fluent/search-24-filled';
import RouteIcon from '~icons/fluent/arrow-routing-24-filled';
import MyLocationIcon from '~icons/fluent/my-location-24-filled';
import LayersIcon from '~icons/fluent/layer-24-filled';
import SettingsIcon from '~icons/fluent/settings-24-filled';
import { ReactComponent as GeocodeIcon } from 'assets/images/icons/geocode.svg';
import logoUrl from 'assets/images/logo.svg';
// import { ReactComponent as MyLocationIcon } from 'assets/images/icons/my-location.svg';
// import { ReactComponent as SettingsIcon } from 'assets/images/icons/settings.svg';

export default function Toolbar() {
  const [map] = useAtom(mapState);
  const [activeTool, setActiveTool] = useAtom(activeToolState);
  const [, setUserLocation] = useAtom(userLocationState);
  const [geoLocationStatus, setGeoLocationStatus] = useAtom(
    geoLocationStatusState
  );

  const toast = useToast();

  const handleGetCurrentLocation = () => {
    if (geoLocationStatus === 'not-supported') {
      toast({
        title: 'مرورگر شما از دریافت امکان دریافت موقعیت پشتبانی نمی‌کند.',
        status: 'error',
      });
    } else if (geoLocationStatus === 'failed') {
      // setIsGeolocationTutorialModalOpen(true);
    } else {
      setGeoLocationStatus('loading');
      findMyLocation()
        .then((position) => {
          setGeoLocationStatus('success');
          const { longitude, latitude } = position.coords;
          const lnglat = { lng: longitude, lat: latitude };
          setUserLocation(lnglat);
          if (map) map?.flyTo({ center: lnglat, zoom: 19 });
        })
        .catch((err) => {
          console.error(err);
          setGeoLocationStatus('failed');
          toast({
            title: 'متاسفانه امکان دریافت موقعیت وجود ندارد.',
            status: 'error',
          });
        });
    }
  };

  function toggle(tool: Tool) {
    setActiveTool((c) => {
      if (c === tool) return undefined;
      else return tool;
    });
  }

  return (
    <Center
      w="90%"
      bg="white"
      margin="0 auto 0"
      p={2}
      position="absolute"
      top={4}
      left="5%"
      shadow="base"
      borderRadius={10}
      zIndex={9}
    >
      <HStack
        w="full"
        justify="start"
        divider={<StackDivider borderColor="gray.200" />}
        fontSize="1.2em"
        p={2}
        overflow="auto"
      >
        <Tooltip
          label={
            <TText>
              جستجو <Kbd color="blackAlpha.800">S</Kbd>
            </TText>
          }
          aria-label="search action"
        >
          <IconButton
            aria-label="Search"
            icon={<Icon as={SearchIcon} />}
            colorScheme={activeTool === 'search' ? 'blue' : 'gray'}
            onClick={toggle.bind(null, 'search')}
          />
        </Tooltip>

        <Tooltip
          label={
            <TText>
              مسیریابی
              <Kbd color="blackAlpha.800">R</Kbd>
            </TText>
          }
          aria-label="Routing action"
        >
          <IconButton
            aria-label="Routing"
            icon={<Icon as={RouteIcon} />}
            colorScheme={activeTool === 'route' ? 'blue' : 'gray'}
            onClick={toggle.bind(null, 'route')}
          />
        </Tooltip>

        <Tooltip
          label={
            <TText>
              آدرس‌یابی <Kbd color="blackAlpha.800">M</Kbd>
            </TText>
          }
          aria-label="reverse-geocode action"
        >
          <IconButton
            aria-label="Reverse Geocode"
            icon={<Icon as={GeocodeIcon} />}
            colorScheme={activeTool === 'reverse-geocode' ? 'blue' : 'gray'}
            onClick={toggle.bind(null, 'reverse-geocode')}
          />
        </Tooltip>

        <Spacer />

        <Tooltip
          label={
            <TText>
              مکان من
              {/* <Kbd color="blackAlpha.800"></Kbd> */}
            </TText>
          }
          aria-label="Find my locaiton action"
        >
          <IconButton
            aria-label="Find My Location"
            icon={<Icon as={MyLocationIcon} />}
            onClick={handleGetCurrentLocation}
          />
        </Tooltip>

        <Tooltip
          label={
            <TText>
              تنظیمات
              {/* <Kbd color="blackAlpha.800"></Kbd> */}
            </TText>
          }
          aria-label="layers action"
        >
          <IconButton
            aria-label="Layers"
            icon={<Icon as={LayersIcon} />}
            colorScheme={activeTool === 'layers' ? 'blue' : 'gray'}
            onClick={toggle.bind(null, 'layers')}
          />
        </Tooltip>

        <Tooltip
          label={
            <TText>
              تنظیمات
              {/* <Kbd color="blackAlpha.800"></Kbd> */}
            </TText>
          }
          aria-label="settings action"
        >
          <IconButton
            aria-label="Settings"
            icon={<Icon as={SettingsIcon} />}
            colorScheme={activeTool === 'settings' ? 'blue' : 'gray'}
            onClick={toggle.bind(null, 'settings')}
          />
        </Tooltip>

        <AspectRatio minW="100px" maxW="400px" ratio={40 / 11}>
          <Image
            src={logoUrl}
            alt="logo"
            // objectFit="contain"
          />
        </AspectRatio>
      </HStack>
    </Center>
  );
}

const TText = chakra(Text, {
  baseStyle: {
    as: 'span',
    display: 'inline-flex',
    // flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: '1ch',
    verticalAlign: 'middle',
  },
});
