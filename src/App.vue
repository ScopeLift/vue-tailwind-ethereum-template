<template>
  <div class="flex flex-col min-h-screen">
    <layout-header id="header" />
    <main class="flex-grow"><router-view /></main>
    <layout-footer id="footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutFooter from './components/LayoutFooter.vue';

export default defineComponent({
  name: 'App',
  components: { LayoutHeader, LayoutFooter },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
