/**
 * Adopted from: https://github.com/tranbathanhtung/usePosition/blob/master/index.js
 */

import { useState, useLayoutEffect } from 'react';
import type { RefObject } from 'react';

const defaultValue = { top: 0, left: 0, width: 0, height: 0 };

// function getStyle(el: HTMLElement, styleName: keyof CSSStyleDeclaration) {
//   return getComputedStyle(el)[styleName];
// }

function getOffset(el: HTMLElement | null) {
  if (!el) {
    return defaultValue;
  }

  const rect = el.getBoundingClientRect();
  const doc = el.ownerDocument;
  if (!doc) throw new Error('Unexpectedly missing <document>.');
  const win = doc.defaultView;
  if (!win) return defaultValue;

  const winX =
    win.pageXOffset !== undefined
      ? win.pageXOffset
      : (doc.documentElement || doc.body.parentNode || doc.body).scrollLeft;
  const winY =
    win.pageYOffset !== undefined
      ? win.pageYOffset
      : (doc.documentElement || doc.body.parentNode || doc.body).scrollTop;

  return {
    top: rect.top + winY,
    left: rect.left + winX,
    width: rect.width,
    height: rect.height,
  };
}

// function getPosition(el: HTMLElement | null) {
//   if (!el) {
//     return defaultValue;
//   }

//   let offset = getOffset(el);
//   const parentOffset = defaultValue;
//   const marginTop = parseInt(getStyle(el, 'marginTop') as string) || 0;
//   const marginLeft = parseInt(getStyle(el, 'marginLeft') as string) || 0;

//   if (getStyle(el, 'position') === 'fixed') {
//     offset = el.getBoundingClientRect();
//   } else {
//     const doc = el.ownerDocument;

//     let offsetParent: HTMLElement =
//       (el.offsetParent as HTMLElement) || doc.documentElement;

//     while (
//       offsetParent &&
//       (offsetParent === doc.body || offsetParent === doc.documentElement) &&
//       offsetParent.parentNode
//     ) {
//       offsetParent = offsetParent.parentNode as HTMLElement;
//     }

//     if (offsetParent && offsetParent !== el && offsetParent.nodeType === 1) {
//       const { top, left } = getOffset(offsetParent);
//       parentOffset.top = top;
//       parentOffset.left = left;

//       parentOffset.top +=
//         parseInt(getStyle(offsetParent, 'borderTopWidth') as string) || 0;
//       parentOffset.left +=
//         parseInt(getStyle(offsetParent, 'borderLeftWidth') as string) || 0;
//     }
//   }

//   return {
//     top: offset.top - parentOffset.top - marginTop,
//     left: offset.left - parentOffset.left - marginLeft,
//     width: offset.width,
//     height: offset.height,
//   };
// }

export default function usePosition(
  ref: RefObject<HTMLElement>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changable?: any
) {
  const { top, left, width, height } = getOffset(ref.current);

  const [ElementPosition, setElementPosition] = useState({
    top,
    left,
    width,
    height,
  });

  function handleChangePosition() {
    if (ref && ref.current) {
      setElementPosition(getOffset(ref.current));
    }
  }

  useLayoutEffect(() => {
    handleChangePosition();
    window.addEventListener('resize', handleChangePosition);

    return () => {
      window.removeEventListener('resize', handleChangePosition);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, changable]);

  return ElementPosition;
}
