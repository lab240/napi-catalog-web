<script setup lang="ts">
import LanguageButton from './components/LanguageButton.vue'
import { onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CatalogSearchTable from './components/CatalogSearchTable.vue'
import ThemeSelect from './components/ThemeSelect.vue'

const { availableLocales, locale, fallbackLocale, t } = useI18n()
const selectedLocale = ref(locale.value)
const externalLinkMenu = ref()
const externalLink = [
  {
    label: t('header.links.catalog'),
    icon: 'pi pi-github',
    url: 'https://github.com/lab240/napi-catalog',
    target: '_blank',
  },
  {
    label: 'napi-linux',
    icon: 'pi pi-link',
    url: 'https://napilinux.ru/',
    target: '_blank',
  },
  {
    label: 'napi-world',
    icon: 'pi pi-link',
    url: 'https://napiworld.ru/',
    target: '_blank',
  },
]

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
  <div class="min-h-screen sm:flex gap-3 my-3">
    <header>
      <Menubar>
        <template #start>
          <div class="ml-auto flex gap-3">
            <router-link to="/">
              <Image
                src="/logo.svg"
                image-class="mt-1"
                alt="NAPI Catalog"
                width="100"
                height="60"
              />
            </router-link>
            <Button
              as="a"
              :label="$t('header.add')"
              icon="pi pi-plus"
              class="p-button"
              href="https://github.com/lab240/napi-catalog/blob/main/CONTRIBUTING.md"
              target="_blank"
              size="small"
              v-tooltip.bottom="{ value: $t('header.addTooltip'), showDelay: 1000, hideDelay: 300 }"
              outlined
              plain
            />
          </div>
        </template>
        <template #end>
          <div class="ml-auto flex gap-3">
            <ThemeSelect />
            <LanguageButton />
            <Button
              icon="pi pi-ellipsis-v"
              @click="externalLinkMenu.toggle($event)"
              aria-haspopup="true"
              aria-controls="overlay_menu"
              v-tooltip.bottom="{
                value: $t('header.links.tooltip'),
                showDelay: 1000,
                hideDelay: 300,
              }"
              outlined
              text
              plain
            />
            <Menu ref="externalLinkMenu" id="overlay_menu" :model="externalLink" :popup="true">
              <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                  <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                  </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                  <span :class="item.icon" />
                  <span class="ml-2">{{ item.label }}</span>
                </a>
              </template>
            </Menu>
          </div>
        </template>
      </Menubar>
      <CatalogSearchTable />
    </header>

    <main>
      <RouterView />
    </main>
    <Toast />
  </div>
</template>
