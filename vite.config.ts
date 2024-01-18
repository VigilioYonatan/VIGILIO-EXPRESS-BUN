import { defineConfig, splitVendorChunkPlugin } from "vite";
import liveReload from "vite-plugin-live-reload";
import preact from "@preact/preset-vite";
import million from "million/compiler";
import path from "node:path";

export default defineConfig({
    plugins: [
        liveReload([
            path.resolve(import.meta.dir, "./resources/views/**/*.ejs"),
        ]),
        splitVendorChunkPlugin(),
        million.vite({ mode: "preact" }),
        preact(),
    ],
    root: "resources",
    base: process.env.NODE_ENV === "production" ? "/dist/" : "/",
    resolve: {
        // RESOURCES ALIAS
        alias: {
            "@": path.resolve(import.meta.dir, "resources", "ts", "services"),
            "~": path.resolve(import.meta.dir, "resources", "ts"),
        },
    },
    build: {
        outDir: path.resolve(import.meta.dir, "public", "dist"),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: path.resolve(import.meta.dir, "resources", "ts", "main.ts"),
        },
    },
    server: {
        strictPort: true,
        port: Number(process.env.VITE_PORT),
        host: true,
        watch: {
            usePolling: true, // docker
        },
    },
});
