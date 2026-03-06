import { defineConfig } from 'vite';
import {viteStaticCopy} from "vite-plugin-static-copy";

export default defineConfig({
    root: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        assetsInlineLimit: 0,
        rollupOptions: {
            input: './index.html'
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'assets/*.svg',
                    dest: 'assets'
                }
            ]
        })
    ]
});