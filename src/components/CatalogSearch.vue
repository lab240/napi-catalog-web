<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

interface ConfigFile {
    name: string
    url: string
    type: string
}

const searchQuery = ref('')
const files = ref<ConfigFile[]>([])
const currentPage = ref(1)
const itemsPerPage = 20

const filteredFiles = computed(() => {
    return files.value.filter(file =>
        file.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        file.type.toLowerCase() !== 'dashboard'
    )
})

const totalPages = computed(() => {
    return Math.ceil(filteredFiles.value.length / itemsPerPage)
})

const paginatedFiles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredFiles.value.slice(start, end)
})

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
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
    const response = await axios.get('https://raw.githubusercontent.com/lab240/napi-catalog/refs/heads/main/catalog.json')
    const catalog = response.data

    // Преобразование данных из catalog.json в массив файлов
    const extractFiles = (obj: any) => {
        const result: ConfigFile[] = []
        for (const key in obj) {
            if (obj[key].files) {
                result.push(...obj[key].files.map((file: any) => ({
                    ...file,
                    type: key
                })))
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
        <input v-model="searchQuery" placeholder="Поиск конфигураций..." @input="resetPage" />
        <ul>
            <li v-for="file in paginatedFiles" :key="file.url">
                {{ file.name }} ({{ file.type }})
                <button @click="downloadFile(file.url, file.name)">Скачать</button>
            </li>
        </ul>
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>
</template>

<style scoped>
    input {
        margin-bottom: 1rem;
        padding: 0.5rem;
        width: 100%;
        box-sizing: border-box;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin-bottom: 0.5rem;
    }

    button {
        margin-left: 1rem;
        color: hsla(160, 100%, 37%, 1);
        text-decoration: underline;
        background: none;
        border: none;
        cursor: pointer;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
    }

    .pagination button {
        margin: 0 0.5rem;
    }
</style>
