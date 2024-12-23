/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/vue" />
/// <reference lib="webworker" />
import type { rawRuData } from "src/types";

declare module "*data.json" {
  const data: rawRuData;
  export = data;
}