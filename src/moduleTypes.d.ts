import type { rawRuData } from '@types';

declare module "data" {
  const data: rawRuData;
  export = data;
}