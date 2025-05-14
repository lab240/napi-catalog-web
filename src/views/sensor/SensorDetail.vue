<template>
  <Card v-if="sensor.model" class="mb-3 overflow-auto">
    <template #title>
      <h1 class="text-2xl font-bold">{{ brandDetails.brand }} {{ sensor.model }}</h1>
      <div class="flex flex-col sm:flex-row gap-2 mt-2 mb-2">
        <Button
          as="a"
          :label="$t('sensor.brand.label')"
          @click="showBrandDetails = true"
          class="p-button"
          icon="pi pi-external-link"
          size="small"
        />
        <Button
          as="a"
          :label="$t('sensor.documentation')"
          icon="pi pi-file"
          class="p-button-info"
          :href="sensor.documentation"
          target="_blank"
          rel="noopener"
          size="small"
        />
        <Button
          as="a"
          :label="$t('sensor.url')"
          icon="pi pi-external-link"
          class="p-button-success"
          :href="sensor.url"
          target="_blank"
          rel="noopener"
          size="small"
        />
        <Button
          as="a"
          :label="$t('sensor.readme')"
          icon="pi pi-book"
          class="p-button-secondary"
          :href="sensor.readme"
          target="_blank"
          rel="noopener"
          size="small"
        />
      </div>
    </template>
    <template #content>
      <Divider />
      <p class="font-semibold my-2">
        {{ $t('sensor.brand.label') }}: <span class="font-normal">{{ sensor.brand }}</span>
      </p>
      <p class="font-semibold my-2">
        {{ $t('sensor.model.label') }}: <span class="font-normal">{{ sensor.model }}</span>
      </p>
      <p class="font-semibold my-2">
        {{ $t('sensor.description.label') }}:
        <span class="font-normal">{{ sensor.description }}</span>
      </p>
      <Divider />
      <div class="flex justify-center">
        <Image
          v-if="sensor.image_url"
          :src="sensor.image_url"
          alt="Sensor Image"
          class="mt-4"
          width="350"
          preview
        />
      </div>
      <Divider align="left" type="solid">
        <b>{{ $t('sensor.tags.label') }}:</b>
      </Divider>
      <div class="flex flex-wrap gap-2">
        <Tag v-for="tag in sensor.tags" :key="tag" :value="tag" :severity="setTagColor(tag)" />
      </div>
      <div v-if="sensor.files" class="mt-4">
        <div v-for="(file, key) in sensor.files" :key="key" class="mb-4">
          <Divider align="left" type="solid">
            <b>{{ key }}:</b>
          </Divider>
          <DataTable
            :value="file.files"
            sortField="version"
            :sortOrder="-1"
            scrollable
            scrollHeight="200px"
            selectionMode="single"
            stripedRows
            removableSort
          >
            <Column field="name" :header="$t('sensor.tables.header.file')" sortable></Column>
            <Column
              v-if="hasVersions(file.files)"
              field="version"
              :header="$t('sensor.tables.header.version')"
              sortable
            >
            </Column>
            <Column
              v-if="hasFileTags(file.files)"
              field="tag"
              :header="$t('catalog.column.tags.header')"
            >
              <template #body="slotProps">
                <Tag
                  v-if="slotProps.data.tag"
                  :value="slotProps.data.tag"
                  :severity="setTagColor(slotProps.data.tag)"
                />
              </template>
            </Column>
            <Column field="url" :header="$t('sensor.tables.header.download')">
              <template #body="slotProps">
                <Button
                  icon="pi pi-download"
                  class="p-button"
                  :href="slotProps.data.url"
                  target="_blank"
                  @click="downloadFile(slotProps.data.url, slotProps.data.name)"
                  size="small"
                  raised
                />
              </template>
            </Column>
            <Column field="url" :header="$t('sensor.tables.header.view')">
              <template #body="slotProps">
                <Button
                  as="a"
                  icon="pi pi-eye"
                  class="p-button-info"
                  :href="slotProps.data.url"
                  target="_blank"
                  size="small"
                  raised
                />
              </template>
            </Column>
          </DataTable>
          <Button
            as="a"
            v-if="file.meta && file.meta.readme"
            :label="$t('sensor.readme')"
            icon="pi pi-book"
            class="p-button-secondary mt-2"
            :href="file.meta.readme"
            target="_blank"
            rel="noopener"
            size="small"
          />
        </div>
      </div>
      <Dialog
        :header="$t('sensor.brand.detail')"
        v-model:visible="showBrandDetails"
        :modal="true"
        :closable="true"
      >
        <div v-if="brandDetails">
          <Image :src="brandDetails.logo" alt="Brand Logo" class="mb-4" width="250" preview />
          <p class="font-semibold">
            {{ $t('sensor.brand.label') }}:
            <span class="font-normal">{{ brandDetails.brand }}</span>
          </p>
          <p class="font-semibold">
            {{ $t('sensor.description.label') }}:
            <span class="font-normal">{{ brandDetails.description }}</span>
          </p>
          <p class="font-semibold">
            {{ $t('sensor.website.label') }}:
            <a :href="brandDetails.website" target="_blank" class="text-primary">{{
              brandDetails.website
            }}</a>
          </p>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </Dialog>
    </template>
  </Card>
  <Card v-else class="ml-3 mr-3 mb-3">
    <template #title>{{ $t('sensor.notFound') }}</template>
    <template #content>
      <p>{{ $t('sensor.notFoundMessage') }}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Image from 'primevue/image'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useToast } from 'primevue/usetoast'
import catalogStore from '../../store/catalogStore'

const { t } = useI18n()
const toast = useToast()

const route = useRoute()
const sensor = ref({})
const showBrandDetails = ref(false)
const brandDetails = ref(null)

const setMetaTags = (sensorData) => {
  const metaTags = [
    {
      property: 'og:title',
      content: `${sensorData.brand} ${sensorData.model}` || 'NaPi sensor catalog',
    },
    { property: 'og:description', content: sensorData.description || '' },
    {
      property: 'og:image',
      content: sensorData.image_url || 'https://sensor.napilinux.ru/logo.svg',
    },
    { property: 'og:url', content: window.location.href },
    { property: 'og:type', content: 'website' },
  ]

  metaTags.forEach((tag) => {
    let element = document.querySelector(`meta[property='${tag.property}']`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute('property', tag.property)
      document.head.appendChild(element)
    }
    element.setAttribute('content', tag.content)
  })
}

const fetchSensorData = async (model) => {
  try {
    // Make sure catalog is loaded
    if (!catalogStore.isLoaded.value) {
      await catalogStore.fetchCatalog()
    }

    const sensorData = catalogStore.getSensor(model)

    if (sensorData) {
      const { brandData, modelData } = sensorData

      // Prepare file structure to collect all files
      const files = {}

      // Process configs if they exist
      if (modelData.configs) {
        files.configs = {
          files: modelData.configs.map((file) => ({
            ...file,
            version: extractVersion(file.name),
          })),
        }
      }

      // Process dashboard if it exists
      if (modelData.dashboard) {
        // Main dashboard files
        if (modelData.dashboard.files) {
          files.dashboard = {
            files: modelData.dashboard.files.map((file) => ({
              ...file,
              version: extractVersion(file.name),
            })),
            meta: modelData.dashboard.meta || {},
          }
        }

        // Process any nested dashboard versions/variants
        Object.keys(modelData.dashboard).forEach((key) => {
          if (key !== 'files' && key !== 'meta' && modelData.dashboard[key].files) {
            files[`dashboard-${key}`] = {
              files: modelData.dashboard[key].files.map((file) => ({
                ...file,
                version: extractVersion(file.name),
              })),
              meta: modelData.dashboard.meta || {},
            }
          }
        })
      }

      // Add any other file categories that might be in the model data
      Object.keys(modelData).forEach((key) => {
        if (
          key !== 'meta' &&
          key !== 'configs' &&
          key !== 'dashboard' &&
          Array.isArray(modelData[key])
        ) {
          files[key] = {
            files: modelData[key].map((file) => ({
              ...file,
              version: extractVersion(file.name),
            })),
          }
        }
      })

      sensor.value = {
        // Use brand field from meta instead of vendor or object key
        brand: brandData.meta.brand || brandData.meta.vendor || Object.keys(brandData)[0],
        model: modelData.meta.model,
        description: modelData.meta.description,
        documentation: modelData.meta.documentation,
        image_url: modelData.meta.image_url,
        readme: modelData.meta.readme,
        tags: modelData.meta.tags || [],
        url: modelData.meta.url,
        files: files,
      }

      setMetaTags(sensor.value)
      // Use the correct brand name
      brandDetails.value = brandData.meta
    } else {
      sensor.value = {}
    }
  } catch (error) {
    console.error('Error fetching sensor data:', error)
    sensor.value = {}
  }
}

// Check if any files have a tag property
const hasFileTags = (files) => {
  return files.some((file) => file.tag)
}

const setTagColor = (tag) => {
  const tagColors = {
    snmp: 'info',
    'modbus rtu': 'success',
    modbusrtu: 'success',
    'modbus tcp': 'warn',
    modbustcp: 'warn',
  }

  return tagColors[tag.toLowerCase()] || 'secondary'
}

const extractVersion = (fileName) => {
  const versionMatch = fileName.match(/_(\d+\.\d+\.\d+)\.conf$/)
  return versionMatch ? versionMatch[1] : null
}

const hasVersions = (files) => {
  return files.some((file) => extractVersion(file.name) !== null)
}

const downloadFile = async (url, fileName) => {
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
    toast.add({
      severity: 'info',
      summary: t('toast.download.summary'),
      detail: t('toast.download.detail') + fileName,
      life: 5000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('toast.download.error'),
      detail: t('toast.download.errorDetail'),
      life: 5000,
    })
    console.error('Error downloading the file', error)
  }
}

onMounted(() => {
  fetchSensorData(route.params.model)
})

watch(
  () => route.params.model,
  (newModel) => {
    fetchSensorData(newModel)
  },
)
</script>
