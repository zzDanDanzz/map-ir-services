import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { usePopper } from '@chakra-ui/popper';

import useOnClickOutside from 'hooks/useOnClickOutside';
import {
  contextMenuPositionState,
  selectedLocationOnMapState,
} from 'atoms/global';

interface IVirtualElement {
  getBoundingClientRect: () => any;
}

export default function ContextMenu() {
  const [contextMenuPosition, setContextMenuPosition] = useAtom(
    contextMenuPositionState
  );

  const [, setSelectedLocationOnMap] = useAtom(selectedLocationOnMapState);

  const reff = useRef<HTMLButtonElement>(null);
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useOnClickOutside(
    useMemo(() => ({ current: ref }), [ref]),
    () => {
      setEnabled(false);
    }
  );

  useEffect(() => {
    if (contextMenuPosition) {
      const { x, y } = contextMenuPosition.point;

      if (reff.current) {
        reff.current.style.top = `${y}px`;
        reff.current.style.left = `${x}px`;
      }
      setEnabled(true);
    } else {
      setRef(null);
      setEnabled(false);
    }
  }, [contextMenuPosition]);

  function handleReverse() {
    setSelectedLocationOnMap(contextMenuPosition?.lngLat);
  }

  return (
    <Menu
      closeOnSelect={false}
      isOpen={Boolean(enabled)}
      placement="auto-start"
    >
      <MenuButton
        ref={reff}
        sx={{
          width: 0,
          height: 0,
          position: 'absolute',
        }}
      ></MenuButton>
      <MenuList minWidth="240px" ref={setRef}>
        <MenuGroup title="عملگرها">
          <MenuItem onClick={handleReverse}>آدرس‌یابی</MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuOptionGroup title="اطلاعات" type="checkbox">
          <MenuItemOption value="lng" textAlign="end">
            lng: {contextMenuPosition?.lngLat.lng}
          </MenuItemOption>
          <MenuItemOption value="lat" textAlign="end">
            lat: {contextMenuPosition?.lngLat.lat}
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
