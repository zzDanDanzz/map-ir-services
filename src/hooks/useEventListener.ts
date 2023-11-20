/**
 * adopted from https://usehooks.com/useEventListener/
 */

import { useRef, useEffect } from 'react';

interface IOptions {
  when?: boolean;
}

export default function useEventListener<E extends keyof HTMLElementEventMap>(
  eventName: E,
  handler: (e: HTMLElementEventMap[E]) => void,
  options?: IOptions,
  element: HTMLElement = document.body,
  once = false
) {
  const { when } = options ?? { when: true };
  const isActive = Boolean(when);

  const savedHandler = useRef<typeof handler>();
  /// Update ref.current value if handler changes.
  /// This allows our effect below to always get latest handler
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported = element && element.addEventListener;
      if (!isActive || !isSupported) return;

      const eventListener = (event: HTMLElementEventMap[E]) =>
        savedHandler.current?.(event);

      element.addEventListener(eventName, eventListener, { once });

      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element, isActive] // Re-run if eventName or element changes
  );
}
