<template>
  <div>Hello {{ userDisplayName }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useWalletStore from 'src/store/wallet';

export default defineComponent({
  name: 'Home',
  setup() {
    const { userDisplayName } = useWalletStore();
    return { userDisplayName };
  },
});
</script>
