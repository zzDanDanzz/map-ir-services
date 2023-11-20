/// From: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/lib/react-app.d.ts#L47
declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}
