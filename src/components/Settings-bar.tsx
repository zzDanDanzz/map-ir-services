import { useState } from 'react';
import useSWR from 'swr';
import {
  Card,
  CardBody,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  StackDivider,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';

import useDebounce from 'hooks/useDebounce';
import useMarker from 'hooks/map/useMarker';
import Mapir, { ISearchResult } from 'utils/mapir';

import { mapState, mapStyleState } from 'atoms/map';

import { SearchIcon } from '@chakra-ui/icons';
import { LngLatLike } from 'maplibre-gl';
import { mapStyles } from './map';

const mapAPI = new Mapir();

interface IProps {
  width: string;
}

export default function Settings({ width }: IProps) {
  const [map] = useAtom(mapState);
  const [mapStyle, setMapStyle] = useAtom(mapStyleState);

  return (
    <Stack
      width={width}
      h="full"
      p={2}
      overflow="auto"
      divider={<StackDivider borderColor="gray.200" />}
    >
      <Stack spacing={4}>
        <Heading as="h5" size="sm">
          لایه پس‌زمینه
        </Heading>
        <SimpleGrid columns={3} spacing={2}>
          {mapStyles.map(({ id, name, previewSrc, scheme }) => (
            <Card
              size="sm"
              key={id}
              onClick={() => {
                if (mapStyle === id) return;
                setMapStyle(id);
              }}
              sx={{
                boxShadow: mapStyle === id ? 'outline' : 'base',
              }}
            >
              <Image src={previewSrc} />

              <CardBody>
                <Heading size="sm">{name}</Heading>

                {/* <Text py="2">
              Caffè latte is a coffee beverage of Italian origin made with
              espresso and steamed milk.
            </Text> */}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
