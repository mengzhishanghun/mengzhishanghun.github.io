import { defineConfig } from 'astro/config';
export default defineConfig({output:'static',trailingSlash:'always',vite:{server:{strictPort:true,proxy:{'/docs':{target:'http://127.0.0.1:4322',changeOrigin:true,ws:true}}}}});
