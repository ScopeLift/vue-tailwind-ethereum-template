<template>
  <header>
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="w-full py-6 flex items-center justify-between border-b border-gray-300 lg:border-none">
        <div class="flex items-center">
          <a href="/">
            <img class="h-10 w-auto" src="../assets/logo.png" alt="logo" />
          </a>
          <div class="hidden ml-10 space-x-8 lg:block">
            <router-link
              v-for="link in navigation"
              :key="link.name"
              :to="link.href"
              active-class="font-bold"
              exact
              class="font-medium text-gray-500 hover:text-gray-900"
            >
              {{ link.name }}
            </router-link>
          </div>
        </div>
        <div class="ml-10 space-x-4">
          <a
            href="#"
            class="
              inline-block
              bg-indigo-500
              py-2
              px-4
              border border-transparent
              rounded-md
              text-base
              font-medium
              text-white
              hover:bg-opacity-75
            "
            >Sign in</a
          >
          <a
            href="/"
            class="
              inline-block
              bg-white
              py-2
              px-4
              border border-transparent
              rounded-md
              text-base
              font-medium
              text-indigo-600
              hover:bg-indigo-50
            "
            >Sign up</a
          >
        </div>
      </div>
      <div class="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
        <router-link
          v-for="link in navigation"
          :key="link.name"
          :to="link.href"
          active-class="font-bold"
          exact
          class="font-medium text-gray-500 hover:text-gray-900"
        >
          {{ link.name }}
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Docs', href: '/docs' },
  { name: 'Contact', href: '/contact' },
];

export default defineComponent({
  name: 'LayoutHeader',
  setup() {
    return {
      navigation,
    };
  },
});
</script>
