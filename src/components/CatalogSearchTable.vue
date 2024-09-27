<template>
    <div class="card">
        <DataTable v-model:filters="filters" :value="sensors" paginator showGridlines :rows="10" dataKey="model"
            filterDisplay="menu" :loading="loading" :globalFilterFields="['brand', 'model', 'tags']">
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No sensors found. </template>
            <template #loading> Loading sensors data. Please wait. </template>
            <Column field="brand" header="Brand" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.brand }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by brand" />
                </template>
            </Column>
            <Column field="model" header="Model" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.model }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Search by model" />
                </template>
            </Column>
            <Column field="tags" header="Tags" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-2">
                        <Tag v-for="tag in data.tags" :key="tag" :value="tag" :severity="setTagColor(tag)" />
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="tags" placeholder="Select One" showClear>
                        <template #option="slotProps">
                            <Tag :value="slotProps.option" :severity="setTagColor(slotProps.option)" />
                        </template>
                    </Select>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';

const sensors = ref([]);
const filters = ref();
const tags = ref([]);
const loading = ref(true);

onMounted(async () => {
    const response = await axios.get('https://raw.githubusercontent.com/lab240/napi-catalog/refs/heads/main/catalog.json');
    const catalog = response.data;
    sensors.value = getSensors(catalog);
    tags.value = getAllTags(sensors.value);
    loading.value = false;
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        brand: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        model: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        tags: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

const getSensors = (data) => {
    const sensorsArray = [];
    for (const brand in data) {
        if (data[brand].meta) {
            for (const model in data[brand]) {
                if (data[brand][model].meta) {
                    sensorsArray.push({
                        brand: data[brand].meta.vendor || brand,
                        model: data[brand][model].meta.model,
                        tags: data[brand][model].meta.tags || []
                    });
                }
            }
        }
    }
    return sensorsArray;
};

const getAllTags = (sensors) => {
    const tagsSet = new Set();
    sensors.forEach(sensor => {
        sensor.tags.forEach(tag => {
            tagsSet.add(tag);
        });
    });
    return Array.from(tagsSet);
};

const setTagColor = (tag) => {
    const colors = ['success', 'info', 'warning', 'danger'];
    const index = tag.length % colors.length;
    return colors[index];
};
</script>
