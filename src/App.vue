<script setup lang="ts">
import CatalogSearch from './components/CatalogSearch.vue';
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <CatalogSearch />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
