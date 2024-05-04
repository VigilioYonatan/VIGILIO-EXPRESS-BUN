import { defineConfig, splitVendorChunkPlugin } from "vite";
import liveReload from "vite-plugin-live-reload";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default defineConfig({
    plugins: [
        liveReload([path.resolve(__dirname, "/resources/views/**/*.njk")]),
        splitVendorChunkPlugin(),
    ],
    root: "resources",
    base: process.env.NODE_ENV === "production" ? "/dist/" : "/",
    build: {
        outDir: path.resolve(__dirname, "public", "dist"),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: path.resolve(__dirname, "resources", "js", "app.js"),
        },
    },
    server: {
        strictPort: true,
        port: Number(process.env.VITE_PORT),
        host: true,
    },
});
