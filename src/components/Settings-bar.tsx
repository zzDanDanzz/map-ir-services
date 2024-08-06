import {
  Card,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Image,
  Grid,
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

        {/* <SimpleGrid columns={3} spacing={2}> */}
        {/*   {mapStyles.map(({ id, name, previewSrc, scheme }) => ( */}
        {/*     <Card */}
        {/*       size="sm" */}
        {/*       key={id} */}
        {/*       onClick={() => { */}
        {/*         if (mapStyle.id === id) return; */}
        {/*         setMapStyle({ id, type: 'vector' }); */}
        {/*       }} */}
        {/*       sx={{ */}
        {/*         boxShadow: mapStyle.id === id ? 'outline' : 'base', */}
        {/*       }} */}
        {/*     > */}
        {/*       <Image src={previewSrc} /> */}
        {/**/}
        {/*       <CardBody> */}
        {/*         <Heading size="sm">{name}</Heading> */}
        {/**/}
        {/*         {/* <Text py="2"> */}
        {/*       Caffè latte is a coffee beverage of Italian origin made with */}
        {/*       espresso and steamed milk. */}
        {/*     </Text>  */}
        {/*       </CardBody> */}
        {/*     </Card> */}
        {/*   ))} */}
        {/* </SimpleGrid> */}

        {/* <div className="flex flex-col gap-2"> */}
        {/*   <span className="text-neutral-600">استایل‌های تصویر</span> */}
        {/*   <div className="flex flex-wrap gap-1">{rasterStyles}</div> */}
        {/*   <span className="text-neutral-600">استایل‌های بردار</span> */}
        {/*   <div className="flex flex-wrap gap-1">{vectorStyles}</div> */}
        {/* </div> */}

        <Heading size={'md'}>استایل‌های تصویر</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          {rasterStyles}
        </Grid>
        <Heading size={'md'}>استایل‌های بردار</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          {vectorStyles}
        </Grid>
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
    <Card bg={active ? 'gray.100' : 'white'} onClick={onClick}>
      <CardBody p={'2'}>
        <Image src={imgSrc} borderRadius="lg" />
        <Heading size="xs" mt={'2'}>
          {name}
        </Heading>
      </CardBody>
    </Card>
  );
}
