<template>
  <Card class="mt-3">
    <template #content>
      <DataTable
        v-model:selection="selectedSensor"
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        selectionMode="single"
        v-model:filters="filters"
        :value="sensors"
        showGridlines
        dataKey="model"
        filterDisplay="menu"
        :loading="loading"
        :globalFilterFields="['brand', 'model', 'tags']"
        @row-click="onRowClick"
        stateStorage="local"
        stateKey="dt-state"
        paginator
        stripedRows
        removableSort
      >
        <template #header>
          <div class="flex flex-col sm:flex-row gap-2 justify-between">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                :placeholder="$t('catalog.table.search')"
                size="small"
              />
            </IconField>
            <Button
              type="button"
              icon="pi pi-filter-slash"
              :label="$t('catalog.table.clear')"
              size="small"
              @click="clearFilter()"
              plain
              text
            />
          </div>
        </template>
        <template #empty>
          <p class="mt-3">{{ $t('catalog.table.empty') }}</p>
          <Button
            as="a"
            :label="$t('header.add')"
            icon="pi pi-plus"
            class="p-button mt-3"
            href="https://github.com/lab240/napi-catalog/blob/main/CONTRIBUTING.md"
            target="_blank"
            size="small"
          />
        </template>
        <template #loading>
          <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Loading"
          />
        </template>
        <Column
          field="brand"
          :header="$t('catalog.column.brand.header')"
          style="min-width: 12rem"
          sortable
        >
          <template #body="{ data }">
            {{ data.brand }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              :placeholder="$t('catalog.column.brand.search')"
            />
          </template>
        </Column>
        <Column
          field="model"
          :header="$t('catalog.column.model.header')"
          style="min-width: 12rem"
          sortable
        >
          <template #body="{ data }">
            {{ data.model }}
          </template>
          <template #filter="{ filterModel }">
            <InputText
              v-model="filterModel.value"
              type="text"
              :placeholder="$t('catalog.column.model.search')"
            />
          </template>
        </Column>
        <Column field="tags" :header="$t('catalog.column.tags.header')" style="min-width: 12rem">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-2">
              <Tag v-for="tag in data.tags" :key="tag" :value="tag" :severity="setTagColor(tag)" />
            </div>
          </template>
          <template #filter="{ filterModel }">
            <Select
              v-model="filterModel.value"
              :options="tags"
              :placeholder="$t('catalog.column.tags.search')"
              filter
              showClear
            >
              <template #option="slotProps">
                <Tag :value="slotProps.option" :severity="setTagColor(slotProps.option)" />
              </template>
            </Select>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
  <div
    class="flex justify-center items-center text-xs font-thin mt-2 mb-2 p-1"
    style="
      background: var(--p-card-background);
      box-shadow: var(--p-card-shadow);
      border-radius: var(--p-card-border-radius);
    "
  >
    {{ $t('footer.project') }}
    <a
      href="https://napilinux.ru/"
      class="text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      >&nbsp;NaPi&nbsp;</a
    >
    © {{ yearRange }}
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'

const sensors = ref([])
const filters = ref()
const tags = ref([])
const loading = ref(true)
const router = useRouter()
const selectedSensor = ref()

onMounted(async () => {
  const response = await axios.get(
    'https://raw.githubusercontent.com/lab240/napi-catalog/refs/heads/main/catalog.json'
  )
  const catalog = response.data
  sensors.value = getSensors(catalog)
  tags.value = getAllTags(sensors.value)
  loading.value = false
})

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    brand: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    model: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    tags: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
    }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const getSensors = (data) => {
  const sensorsArray = []
  for (const brand in data) {
    if (data[brand].meta) {
      for (const model in data[brand]) {
        if (data[brand][model].meta) {
          sensorsArray.push({
            brand: data[brand].meta.vendor || brand,
            model: data[brand][model].meta.model,
            tags: data[brand][model].meta.tags || []
          })
        }
      }
    }
  }
  return sensorsArray
}

const getAllTags = (sensors) => {
  const tagsSet = new Set()
  sensors.forEach((sensor) => {
    sensor.tags.forEach((tag) => {
      tagsSet.add(tag)
    })
  })
  return Array.from(tagsSet)
}

const setTagColor = (tag) => {
  const tagColors = {
    snmp: 'info',
    'modbus rtu': 'success',
    modbusrtu: 'success',
    'modbus tcp': 'warn',
    modbustcp: 'warn'
  }

  return tagColors[tag.toLowerCase()] || 'secondary'
}

const onRowClick = (event) => {
  router.push({ path: `/sensor/${event.data.model}` })
}

const yearRange = computed(() => {
  const startYear = 2023
  const currentYear = new Date().getFullYear()
  return currentYear > startYear ? `${startYear} - ${currentYear}` : `${startYear}`
})
</script>
