import { computed, onMounted, ref } from 'vue';

// Local storage key names
const settings = {
  lastWallet: 'last-wallet',
};

// Helper methods to load save items from local storage
const load = (key: string) => window.localStorage.getItem(key);
const save = (key: string, value: any) => window.localStorage.setItem(key, value);

// Shared state
const lastWallet = ref<string>(); // name of last wallet used

// Composition function for managing state
export default function useSettingsStore() {
  onMounted(() => {
    // Load settings
    lastWallet.value = load(settings.lastWallet) ? String(load(settings.lastWallet)) : undefined;
  });

  function setLastWallet(walletName: string) {
    save(settings.lastWallet, walletName);
  }

  return {
    setLastWallet,
    lastWallet: computed(() => lastWallet.value),
  };
}
