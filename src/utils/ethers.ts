/**
 * @notice Contains all ethers imports used by the app. This helps track which ethers packages used since all imports
 * are in this file, and it removes noise from having a lot of import lines in other packages
 * @dev In some cases we use `export type` instead of `export`. This is used for types that are imported then
 * reexported, such as the following from @ethersproject/networks/src.ts/index.ts
 *
 *     import type { Network, Networkish } from "./types";
 *     export {
 *         Network,
 *         Networkish
 *     };
 *
 * If we used `export` below, Vite would throw when building with an error such as `Uncaught SyntaxError: The requested
 * module '/node_modules/.vite/@ethersproject_networks.js?v=d77d69a4' does not provide an export named 'Network'`.
 * Read more at https://github.com/vitejs/vite/issues/731
 */

export { getAddress } from '@ethersproject/address';
export type { Network } from '@ethersproject/networks';
export { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
