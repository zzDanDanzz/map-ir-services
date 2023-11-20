import {
  Box,
  Center,
  HStack,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Sheet from 'react-modal-sheet';

import Map from './components/map';
import Toolbar from 'components/toolbar';
import ContextMenu from 'components/context-menu';
import GeocodeInfo from 'components/geocode-info';
import Route from 'components/route';
import SearchBar from 'components/search-bar';
import Settings from 'components/Settings-bar';

import { activeToolState } from 'atoms/global';

import './styles/index.css';

import ResizeHandleIcon from '~icons/fluent/re-order-dots-vertical-16-filled';

import type { Tool } from 'types/global';
import { useEffect, useMemo, useState } from 'react';

function App() {
  const [isOpen, setOpen] = useState(false);

  const [activeTool, setActiveTool] = useAtom(activeToolState);

  const deviceType = useBreakpointValue<'mobile' | 'desktop'>({
    base: 'mobile',
    lg: 'desktop',
  });

  console.log('🚀 ~ file: App.tsx:42 ~ App ~ deviceType:', deviceType);
  console.log('🚀 ~ file: App.tsx:45 ~ SideBar ~ activeTool:', activeTool);

  const SideBar = useMemo(() => {
    if (activeTool === 'search') return <SearchBar width="full" />;
    else if (activeTool === 'settings') return <Settings width="full" />;
    else if (activeTool === 'reverse-geocode') return <GeocodeInfo />;
    else if (activeTool === 'route') return <Route width="full" />;
    else return undefined;
  }, [activeTool]);

  return (
    <HStack w="full" h="full" spacing={0}>
      <Box w="full" h="full" position="fixed" zIndex={0}>
        <Map />
      </Box>
      <ContextMenu />

      <Box as={PanelGroup} direction="horizontal">
        {deviceType === 'desktop' && SideBar && (
          <>
            <Panel defaultSize={30} minSize={30} maxSize={50}>
              <Box h="full" bg="white" zIndex={1} position="relative">
                {SideBar}
              </Box>
            </Panel>
            <Box
              as={PanelResizeHandle}
              flex="0 0 1.5em"
              position="relative"
              outline="none"
              css={`
                --background-color: transparent;
                &[data-resize-handle-active] {
                  --background-color: var(--chakra-colors-gray-100);
                }
              `}
            >
              <Center
                position="absolute"
                top="0.25em"
                bottom="0.25em"
                left="0.25em"
                right="0.25em"
                borderRadius="0.25em"
                sx={{
                  backgroundColor: 'var(--background-color)',
                }}
              >
                <Icon as={ResizeHandleIcon} />
              </Center>
            </Box>
          </>
        )}

        <Panel>
          <Box position="relative" shadow="md">
            <Toolbar />
          </Box>
        </Panel>
      </Box>

      <Sheet
        isOpen={Boolean(activeTool)}
        detent="full-height"
        snapPoints={[0.8, 0.6, 0.4, 200, 0]}
        initialSnap={1}
        onClose={() => {
          setOpen(false);
          setActiveTool(undefined);
        }}
      >
        {deviceType === 'mobile' && SideBar ? (
          <Sheet.Container>
            <Sheet.Header
              style={{
                direction: 'ltr',
              }}
            />
            <Sheet.Content>{SideBar}</Sheet.Content>
          </Sheet.Container>
        ) : null}

        {/* <Sheet.Backdrop /> */}
      </Sheet>
    </HStack>
  );
}

export default App;
