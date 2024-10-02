<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  label?: boolean
}>()

const { availableLocales, locale, fallbackLocale, t } = useI18n()
const selectedLocale = ref(locale.value)
const localeMenu = ref()

const updateLocale = (newLocale: string) => {
  if (!availableLocales.includes(newLocale)) {
    selectedLocale.value = fallbackLocale.value.toString()
  } else {
    selectedLocale.value = newLocale
  }
  locale.value = selectedLocale.value
  document.documentElement.lang = selectedLocale.value
  localStorage.setItem('user-locale', selectedLocale.value)
}

onMounted(() => {
  const persistedLocale = localStorage.getItem('user-locale')
  if (persistedLocale && availableLocales.includes(persistedLocale)) {
    selectedLocale.value = persistedLocale
  } else if (!availableLocales.includes(selectedLocale.value)) {
    selectedLocale.value = fallbackLocale.value.toString()
  }
  locale.value = selectedLocale.value
  document.documentElement.lang = selectedLocale.value
})

watch(selectedLocale, (newLocale) => {
  locale.value = newLocale
  document.documentElement.lang = newLocale
  localStorage.setItem('user-locale', newLocale)
})

const localeOptions = computed(() => {
  return availableLocales.map((loc) => ({
    label: t(`lang.${loc}`),
    value: loc,
    command: () => {
      updateLocale(loc)
    }
  }))
})
</script>

<template>
  <div class="flex items-center space-x-4">
    <Button icon="pi pi-language" @click="localeMenu.toggle($event)" aria-haspopup="true" aria-controls="overlay_menu"
      v-tooltip.bottom="{ value: $t('lang.title'), showDelay: 1000, hideDelay: 300 }" />
    <Menu ref="localeMenu" id="overlay_menu" :model="localeOptions" :popup="true" />
  </div>
</template>
