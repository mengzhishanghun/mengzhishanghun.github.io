import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import { remarkMedia } from '../shared/markdown/media';
export default defineConfig({output:'static',trailingSlash:'always',markdown:{processor:unified({remarkPlugins:[remarkDirective,remarkMedia]})},vite:{server:{strictPort:true,proxy:{'/docs':{target:'http://127.0.0.1:4322',changeOrigin:true,ws:true}}}}});
