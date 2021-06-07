/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Heroicons package does not support TypeScript, so we use this to avoid `Could not find a declaration file for
// module '@heroicons/vue/solid'` errors. More info at:
//   - https://github.com/tailwindlabs/heroicons/issues/64
//   - https://github.com/tailwindlabs/heroicons/issues/252
//   - https://github.com/tailwindlabs/heroicons/issues/276
declare module '@heroicons/*';
