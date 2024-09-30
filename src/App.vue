<script setup lang="ts">
// import CatalogSearch from './components/CatalogSearch.vue';
import LanguageButton from './components/LanguageButton.vue'
import LanguageSelect from './components/LanguageSelect.vue'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CatalogSearchTable from './components/CatalogSearchTable.vue'
import ThemeSelect from './components/ThemeSelect.vue'

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
    <header class="flex justify-start">
        <Toolbar class="w-full">
            <template #start>
                <h4>Home</h4>
            </template>
            <template #end>
                <div class="flex gap-2">
                    <LanguageButton />
                    <LanguageSelect />
                    <ThemeSelect />
                </div>
            </template>
        </Toolbar>
    </header>

    <!-- <Splitter class="m-5">
            <SplitterPanel :minSize="40" class="flex items-center justify-center"> -->
    <CatalogSearchTable />
    <!-- </SplitterPanel>
            <SplitterPanel  :minSize="50" class="flex items-center justify-center"> Panel 2 </SplitterPanel>
        </Splitter> -->
    <!-- <div class="wrapper">
            <HelloWorld msg="You did it!" /> -->
    <!-- <CatalogSearch /> -->
    <!-- <CatalogSearchTable /> -->
    <!-- <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav> -->
    <!-- </div> -->
</template>
