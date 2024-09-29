<script setup lang="ts">
import Menubar from 'primevue/menubar';
import LanguageButton from './components/LanguageButton.vue';
import LanguageSelect from './components/LanguageSelect.vue';
import { onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CatalogSearchTable from './components/CatalogSearchTable.vue';
import ThemeSelect from './components/ThemeSelect.vue';

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
    <div class="card flex sm:flex-row gap-3 mb-2">
      <Button as="a" icon="pi pi-home" href="/" />
      <Button as="a" label="Add" icon="pi pi-plus" class="p-button"
        href="https://github.com/lab240/napi-catalog/blob/main/CONTRIBUTING.md" target="_blank" />
      <div class="ml-auto flex gap-3">
        <ThemeSelect />
        <LanguageButton />
      </div>
    </div>
    <CatalogSearchTable />

  </header>

  <main>
    <RouterView />
  </main>
</template>
