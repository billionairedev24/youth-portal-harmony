import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ["VITE_"]);

  const isProduction = mode === "production";
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:9090';

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }) as any,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: isProduction ? "hidden" : false,
      minify: isProduction ? "terser" : false,
      chunkSizeWarningLimit: 1600,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "vendor-react";
              if (id.includes("zustand") || id.includes("@tanstack")) return "vendor-state";
              if (id.includes("axios")) return "vendor-http";
              return "vendor-other";
            }
          },
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`
        },
        treeshake: {
          preset: "recommended",
          moduleSideEffects: false
        }
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          pure_funcs: ["console.debug"]
        },
        format: {
          comments: false
        }
      }
    },
    esbuild: {
      drop: isProduction ? ["console", "debugger"] : []
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
      exclude: ["js-big-decimal"]
    }
  };
});