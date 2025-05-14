<template>
  <div class="flex items-center space-x-4">
    <Button
      :icon="currentIcon"
      @click="themeToggle"
      aria-label="Themes"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      v-tooltip.bottom="{ value: $t('theme.subtitle'), showDelay: 1000, hideDelay: 300 }"
      outlined
      text
      plain
    />
    <Menu ref="themeMenu" id="overlay_menu" :model="themeItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { setLightMode, setDarkMode, setOSPreference, applyTheme } from '@/plugins/theme'
import { computed, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
const { t } = useI18n()

const themeMenu = ref()
const currentIcon = ref('pi pi-desktop')

const themeItems = computed(() => [
  {
    label: t('theme.subtitle'),
    items: [
      {
        label: t('theme.dark'),
        icon: 'pi pi-moon',
        command: () => {
          setDarkMode()
          updateCurrentIcon()
        },
      },
      {
        label: t('theme.light'),
        icon: 'pi pi-sun',
        command: () => {
          setLightMode()
          updateCurrentIcon()
        },
      },
      {
        label: t('theme.system'),
        icon: 'pi pi-desktop',
        command: () => {
          setOSPreference()
          updateCurrentIcon()
        },
      },
    ],
  },
])

const themeToggle = (event: any) => {
  themeMenu.value.toggle(event)
}

const updateCurrentIcon = () => {
  if (localStorage.theme === 'app-dark') {
    currentIcon.value = 'pi pi-moon'
  } else if (localStorage.theme === 'app-light') {
    currentIcon.value = 'pi pi-sun'
  } else {
    currentIcon.value = 'pi pi-desktop'
  }
}

// Watch for changes in the theme and update the icon accordingly
watchEffect(() => {
  updateCurrentIcon()
})

// Apply theme on initial load
applyTheme()
updateCurrentIcon()
</script>
