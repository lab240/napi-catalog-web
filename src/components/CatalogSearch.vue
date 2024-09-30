<!-- <script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Paginator from 'primevue/paginator'

interface ConfigFile {
    name: string
    url: string
    type: string
}

const searchQuery = ref('')
const files = ref<ConfigFile[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredFiles = computed(() => {
    return files.value.filter(
        (file) =>
            file.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
            file.type.toLowerCase() !== 'dashboard'
    )
})

const paginatedFiles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredFiles.value.slice(start, end)
})

const onPageChange = (event: any) => {
    currentPage.value = event.page + 1
    itemsPerPage.value = event.rows
}

const resetPage = () => {
    currentPage.value = 1
}

const downloadFile = async (url: string, fileName: string) => {
    try {
        const response = await axios.get(url, { responseType: 'blob' })
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
    } catch (error) {
        console.error('Error downloading the file', error)
    }
}

onMounted(async () => {
    const response = await axios.get(
        'https://raw.githubusercontent.com/lab240/napi-catalog/refs/heads/main/catalog.json'
    )
    const catalog = response.data

    // Преобразование данных из catalog.json в массив файлов
    const extractFiles = (obj: any) => {
        const result: ConfigFile[] = []
        for (const key in obj) {
            if (obj[key].files) {
                result.push(
                    ...obj[key].files.map((file: any) => ({
                        ...file,
                        type: key
                    }))
                )
            }
            if (typeof obj[key] === 'object') {
                result.push(...extractFiles(obj[key]))
            }
        }
        return result
    }

    files.value = extractFiles(catalog)
})
</script>

<template>
    <div>
        <IconField>
            <InputIcon class="pi pi-search" />
            <InputText id="search-conf" v-model="searchQuery" :placeholder="$t('catalog.header.title')" />
        </IconField>

        <ul>
            <li v-for="file in paginatedFiles" :key="file.url" class="mb-3">
                {{ file.name }} ({{ file.type }})
                <Button :label="$t('button.download.label')" icon="pi pi-check" iconPos="right"
                    @click="downloadFile(file.url, file.name)" raised />
            </li>
        </ul>
            <Paginator :first="(currentPage - 1) * itemsPerPage" :rows="itemsPerPage" :totalRecords="filteredFiles.length"
                :rowsPerPageOptions="[5, 10, 20, 30]" @page="onPageChange" />
    </div>
</template> -->
