<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { availableLocales, locale, fallbackLocale, t } = useI18n()
const selectedLocale = ref(locale.value)

const localeOptions = computed(() => {
  return availableLocales.map((locale) => ({
    name: t(`lang.${locale}`),
    value: locale
  }))
})

const updateLocale = (newLocale: string) => {
  if (!availableLocales.includes(newLocale)) {
    selectedLocale.value = fallbackLocale.value.toString()
  } else {
    locale.value = newLocale
  }
  document.documentElement.lang = selectedLocale.value
  localStorage.setItem('user-locale', selectedLocale.value)
}

watch(selectedLocale, updateLocale)

onMounted(() => {
  const persistedLocale = localStorage.getItem('user-locale')
  if (persistedLocale && availableLocales.includes(persistedLocale)) {
    selectedLocale.value = persistedLocale
  } else if (!availableLocales.includes(selectedLocale.value)) {
    selectedLocale.value = fallbackLocale.value.toString()
  }
  document.documentElement.lang = selectedLocale.value
})
</script>

<template>
  <Select
    v-model="selectedLocale"
    :options="localeOptions"
    optionLabel="name"
    optionValue="value"
    :placeholder="$t('lang.meta.placeholder')"
    class="w-full md:w-60"
  />
</template>
