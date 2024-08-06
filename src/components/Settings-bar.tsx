import {
  Card,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Image,
  Grid,
  Flex,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import {
  mapStylesSources,
  RasterSourceIDs,
  styleNames,
  styleThumbnails,
  VectorSourceIDs,
} from '../utils/map-styles';

import { mapStyleState } from 'atoms/map';

interface IProps {
  width: string;
}

export default function Settings({ width }: IProps) {
  const [mapStyle, setMapStyle] = useAtom(mapStyleState);

  const rasterStyles = mapStylesSources
    .filter((ms) => ms.type === 'raster')
    .map((ms) => (
      <MapStyleCard
        key={ms.source}
        imgSrc={styleThumbnails[ms.source]}
        active={ms.source === mapStyle.source}
        onClick={() => {
          setMapStyle({
            source: ms.source as RasterSourceIDs,
            type: 'raster',
          });
        }}
        name={styleNames[ms.source]}
      />
    ));

  const vectorStyles = mapStylesSources
    .filter((ms) => ms.type === 'vector')
    .map((ms) => (
      <MapStyleCard
        key={ms.source}
        imgSrc={styleThumbnails[ms.source]}
        active={ms.source === mapStyle.source}
        onClick={() => {
          setMapStyle({
            source: ms.source as VectorSourceIDs,
            type: 'vector',
          });
        }}
        name={styleNames[ms.source]}
      />
    ));

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

        <Heading size={'md'}>استایل‌های تصویر</Heading>
        <Flex wrap={'wrap'} gap={3}>
          {rasterStyles}
        </Flex>
        <Heading size={'md'}>استایل‌های بردار</Heading>
        <Flex wrap={'wrap'} gap={3}>
          {vectorStyles}
        </Flex>
      </Stack>
    </Stack>
  );
}

function MapStyleCard({
  imgSrc,
  name,
  active,
  onClick,
}: {
  imgSrc: string;
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Card bg={active ? 'gray.100' : 'white'} onClick={onClick} maxW={'32'}>
      <CardBody p={'2'}>
        <Image src={imgSrc} borderRadius="lg" />
        <Heading size="xs" mt={'2'}>
          {name}
        </Heading>
      </CardBody>
    </Card>
  );
}
