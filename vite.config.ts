import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    base: env.VITE_BASE,
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"), // 设置 `@` 指向 `src` 目录
        "~/": `${resolve(__dirname, "src")}/`,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/element/index.scss" as *;`,
        },
      },
    },
    plugins: [
      vue(),
      ElementPlus({
        useSource: true,
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
      }),
    ],
  });
};
