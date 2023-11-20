import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from '@svgr/rollup';
import checker from 'vite-plugin-checker';
import Icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      icon: true,
      replaceAttrValues: { '#000': 'currentColor' },
      exportType: 'named',
    }),
    checker({
      typescript: true,
    }),
    Icons({
      autoInstall: true,
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  server: {
    host: true,
    cors: true,
  },
  envPrefix: 'PUBLIC_',
  base: '/nak-map-test'
});
