<script setup lang="ts">
import CatalogSearch from './components/CatalogSearch.vue';
import LanguageButton from './components/LanguageButton.vue';
import LanguageSelect from './components/LanguageSelect.vue';
import { onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CatalogSearchTable from './components/CatalogSearchTable.vue';

const { availableLocales, locale, fallbackLocale } = useI18n()
const selectedLocale = ref(locale.value)
onMounted(() => {
  if (!availableLocales.includes(selectedLocale.value)) {
    selectedLocale.value = fallbackLocale.value.toString()
  }
  document.documentElement.lang = selectedLocale.value

  const persistedLocale = localStorage.getItem('user-locale')
  if (persistedLocale && availableLocales.includes(persistedLocale)) {
    locale.value = persistedLocale
  }
})

watch(selectedLocale, (newLocale) => {
  document.documentElement.lang = newLocale
  localStorage.setItem('user-locale', newLocale)
})
</script>

<template>
  <header>
    <LanguageButton />
    <LanguageSelect />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <!-- <CatalogSearch /> -->
      <CatalogSearchTable />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>
