/**
 * State is handled in reusable components, where each component is its own self-contained
 * file consisting of one function defined used the composition API.
 *
 * Since we want the wallet state to be shared between all instances when this file is imported,
 * we defined state outside of the function definition.
 */

import { computed, onMounted, ref } from 'vue';
import useSettingsStore from 'src/store/settings';
import { JsonRpcSigner, Network, Web3Provider } from 'src/utils/ethers';
import { formatAddress } from 'src/utils/formatters';
import Onboard from 'bnc-onboard';
import { API as OnboardAPI } from 'bnc-onboard/dist/src/interfaces';
import { getAddress } from 'src/utils/ethers';

const { setLastWallet } = useSettingsStore();

// State variables
let onboard: OnboardAPI;
const supportedChainIds = [1]; // chain IDs supported by this app
const rawProvider = ref<any>(); // raw provider from the user's wallet, e.g. EIP-1193 provider
const provider = ref<Web3Provider>(); // ethers provider
const signer = ref<JsonRpcSigner>(); // ethers signer
const userAddress = ref<string>(); // user's wallet address
const userEns = ref<string>(); // user's ENS name
const network = ref<Network>(); // connected network, derived from provider

/**
 * @notice Clear wallet state, useful when user switches wallets. We don't need to clear the provider and signer and
 * ethers will automatically update those
 */
function resetState() {
  userAddress.value = undefined;
  network.value = undefined;
}

// Settings
const rpcUrl = process.env.VUE_APP_RPC_URL;
const infuraApiKey = process.env.VUE_APP_INFURA_API_KEY;
const walletChecks = [{ checkName: 'connect' }];
const wallets = [
  { walletName: 'metamask', preferred: true },
  { walletName: 'walletConnect', infuraKey: infuraApiKey, preferred: true },
  { walletName: 'torus', preferred: true },
  { walletName: 'ledger', rpcUrl, preferred: true },
  { walletName: 'lattice', rpcUrl, appName: 'Umbra' },
];

export default function useWalletStore() {
  // ------------------------------------------------ Wallet Connection ------------------------------------------------
  /**
   * @notice Initialize the onboard.js module
   */
  function initializeOnboard() {
    onboard = Onboard({
      dappId: process.env.VUE_APP_BLOCKNATIVE_API_KEY,
      darkMode: false,
      networkId: 1,
      walletSelect: { wallets },
      walletCheck: walletChecks,
      subscriptions: {
        // On wallet connection, save wallet in local storage and set provider
        wallet: (wallet) => {
          setProvider(wallet.provider);
          if (wallet.name) setLastWallet(wallet.name);
        },
        // On address or network change, re-run configureProvider
        address: async (address) => {
          if (userAddress.value && userAddress.value !== getAddress(address)) await configureProvider();
        },
        network: async (chainId) => {
          if (network.value?.chainId && network.value.chainId !== chainId) await configureProvider();
        },
      },
    });
  }

  /**
   * @notice Prompt user to connect wallet, or attempt to connect to wallet specified by `name`
   * @param name Wallet name to connect, or undefined to prompt user to select a wallet
   */
  async function connectWallet(name: string | undefined = undefined) {
    // If user already connected wallet, return
    if (userAddress.value) return;

    // Otherwise, prompt them for connection / wallet change
    if (!onboard) initializeOnboard(); // instantiate Onboard instance
    onboard.walletReset(); // clear existing wallet selection
    await onboard.walletSelect(name); // wait for user to select wallet
    await onboard.walletCheck(); // run any specified checks
    await configureProvider(); // load info based on user's address
  }

  // ----------------------------------------------------- Actions -----------------------------------------------------
  // Try connecting user's wallet on page load
  onMounted(async () => {
    // const { lastWallet } = useSettingsStore();
    // if (lastWallet.value) await connectWallet(lastWallet.value);
  });

  // When user connects their wallet, we call this method to update the provider
  function setProvider(p: any) {
    rawProvider.value = p;
  }

  // Any actions or data to fetch dependent on user's wallet are done here
  async function configureProvider() {
    // Set network/wallet properties
    if (!rawProvider.value) return;
    const _provider = new Web3Provider(rawProvider.value);
    const _signer = _provider.getSigner();

    // Get user and network information
    const [_userAddress, _network] = await Promise.all([
      _signer.getAddress(), // get user's address
      _provider.getNetwork(), // get information on the connected network
    ]);

    // If nothing has changed, no need to continue configuring
    if (_userAddress === userAddress.value && _network.chainId === network.value?.chainId) return;

    // Clear state
    resetState();

    // Exit if not a valid network
    const chainId = _provider.network.chainId; // must be done after the .getNetwork() call
    if (!supportedChainIds.includes(chainId)) {
      network.value = _network; // save network for checking if this is a supported network
      return;
    }

    // Get ENS name
    const _userEns = await _provider.lookupAddress(_userAddress);
    console.log('_userEns: ', _userEns);

    // Now we save the user's info to the store. We don't do this earlier because the UI is reactive based on these
    // parameters, and we want to ensure this method completed successfully before updating the UI
    provider.value = _provider;
    signer.value = _signer;
    userAddress.value = _userAddress;
    userEns.value = _userEns;
    network.value = _network;
  }

  // ---------------------------------------------------- Exports ----------------------------------------------------
  // Define parts of the store to expose. Only expose computed properties or methods to avoid direct mutation of state
  return {
    // Methods
    configureProvider,
    connectWallet,
    setProvider,
    // Properties
    isSupportedNetwork: computed(() => (network.value ? supportedChainIds.includes(network.value.chainId) : true)), // assume valid if we have no network information
    network: computed(() => network.value),
    provider: computed(() => provider.value),
    signer: computed(() => signer.value),
    userAddress: computed(() => userAddress.value),
    userDisplayName: computed(() => userEns.value || formatAddress(userAddress.value || '')),
  };
}
