import { useState } from 'react';
import useSWR from 'swr';
import {
  Box,
  Checkbox,
  Divider,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';

import useDebounce from 'hooks/useDebounce';
import useMarker from 'hooks/map/useMarker';
import Mapir, { ISearchResult } from 'utils/mapir';

import { mapState } from 'atoms/map';

import { SearchIcon } from '@chakra-ui/icons';
import { LngLatLike } from 'maplibre-gl';

const mapAPI = new Mapir();

interface IProps {
  width: string;
}

export default function SearchBar({ width }: IProps) {
  const [map] = useAtom(mapState);

  const [text, setText] = useState('');
  const [isAutocomplete, setIsAutocomplete] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<LngLatLike>();

  const debouncedText = useDebounce(text, 400);

  const { data, isLoading, isValidating, mutate } = useSWR(
    debouncedText.length > 0 ? ['search', debouncedText, isAutocomplete] : null,
    ([, text, isAutocomplete]) => {
      const location = map?.getCenter();
      if (location) return mapAPI.search(text, location, isAutocomplete);
      else return undefined;
    }
  );

  useMarker({ position: markerPosition });

  function onResultItemClick(item: ISearchResult['value'][number]) {
    const { Coordinate } = item;
    setMarkerPosition(Coordinate);
    map?.flyTo({
      center: Coordinate,
    });
  }

  return (
    <Stack width={width} h="full" p={2} pt={4} overflow="auto">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children={isValidating ? <Spinner size="sm" /> : null}
        />
        <Input
          placeholder="جستجو"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <InputRightElement
          children={<SearchIcon color="grey.500" onClick={() => mutate()} />}
        />
      </InputGroup>

      <Checkbox
        size="sm"
        colorScheme="green"
        isChecked={isAutocomplete}
        onChange={(e) => setIsAutocomplete(e.target.checked)}
      >
        autocomplete
      </Checkbox>

      <Divider p={4} />

      <Stack
        // divider={<StackDivider borderColor="gray.200" />}
        spacing={2}
        align="stretch"
        pt={2}
      >
        {data?.value?.map((i) => (
          <Stack
            key={i.Id}
            p={2}
            spacing={0}
            cursor="pointer"
            onClick={onResultItemClick.bind(null, i)}
            bg="gray.50"
            _hover={{
              background: 'gray.100',
            }}
          >
            <Heading size="xs" textTransform="uppercase">
              {i.Title}
            </Heading>
            <Text pt="2" fontSize="sm">
              {i.Text}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
