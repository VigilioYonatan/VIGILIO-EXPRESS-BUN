import { defineConfig, splitVendorChunkPlugin } from "vite";
import liveReload from "vite-plugin-live-reload";
import preact from "@preact/preset-vite";
import million from "million/compiler";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
export default defineConfig({
    plugins: [
        liveReload([path.resolve(__dirname, "./resources/views/**/*.ejs")]),
        splitVendorChunkPlugin(),
        million.vite({ mode: "preact" }),
        preact(),
    ],
    root: "resources",
    base:
        process.env.NODE_ENV === "production"
            ? `${process.env.VITE_URL}/dist/`
            : "/",
    resolve: {
        // RESOURCES ALIAS
        alias: {
            "@": path.resolve(__dirname, "resources", "ts", "services"),
            "~": path.resolve(__dirname, "resources", "ts"),
        },
    },
    build: {
        outDir: path.resolve(__dirname, "public", "dist"),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: path.resolve(__dirname, "resources", "ts", "main.ts"),
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
