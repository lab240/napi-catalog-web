<template>
    <div class="card ml-3 mr-3">
        <template v-if="sensor.model">
            <h1 class="text-2xl font-bold">{{ brandDetails.brand }} {{ sensor.model }}</h1>
            <Divider />
            <div class="flex flex-col sm:flex-row gap-2 mt-2 mb-2">
                <Button as="a" label="Brand Details" @click="showBrandDetails = true" class="p-button" />
                <Button as="a" label="Documentation" icon="pi pi-file" class="p-button-info"
                    :href="sensor.documentation" target="_blank" rel="noopener" />
                <Button as="a" label="Product URL" icon="pi pi-external-link" class="p-button-success"
                    :href="sensor.url" target="_blank" rel="noopener" />
                <Button as="a" label="Readme" icon="pi pi-book" class="p-button-secondary" :href="sensor.readme"
                    target="_blank" rel="noopener" />
            </div>
            <Divider />
            <p class="font-semibold my-2">Brand: <span class="font-normal">{{ sensor.brand }}</span></p>
            <p class="font-semibold my-2">Description: <span class="font-normal">{{ sensor.description }}</span></p>
            <Divider />
            <div class="flex justify-center">
                <Image :src="sensor.image_url" alt="Sensor Image" class="mt-4" width="350" preview />
            </div>
            <Divider align="left" type="solid">
                <b>Tags:</b>
            </Divider>
            <div class="flex flex-wrap gap-2">
                <Tag v-for="tag in sensor.tags" :key="tag" :value="tag" :severity="setTagColor(tag)" />
            </div>
            <div v-if="sensor.files" class="mt-4">
                <div v-for="(file, key) in sensor.files" :key="key" class="mb-4">
                    <Divider align="left" type="solid">
                        <b>{{ key }}:</b>
                    </Divider>
                    <DataTable :value="file.files" sortField="version" :sortOrder="-1" scrollable scrollHeight="200px"
                        selectionMode="single" stripedRows removableSort>
                        <Column field="name" header="File" sortable></Column>
                        <Column v-if="hasVersions(file.files)" field="version" header="Version" sortable></Column>
                        <Column field="url" header="Download">
                            <template #body="slotProps">
                                <Button icon='pi pi-download' class='p-button' :href='slotProps.data.url'
                                    target='_blank' @click="downloadFile(slotProps.data.url, slotProps.data.name)"
                                    raised />
                            </template>
                        </Column>
                        <Column field="url" header="View">
                            <template #body="slotProps">
                                <Button as="a" icon='pi pi-eye' class='p-button-info' :href='slotProps.data.url'
                                    target='_blank' raised />
                            </template>
                        </Column>
                    </DataTable>
                    <Button as="a" v-if="file.meta && file.meta.readme" label="Readme" icon="pi pi-book"
                        class="p-button-secondary mt-2" :href="file.meta.readme" target="_blank" rel="noopener" />
                </div>
            </div>
        </template>
        <template v-else>
            <p>Sensor data not available</p>
        </template>


        <Dialog header="Brand Details" v-model:visible="showBrandDetails" :modal="true" :closable="true">
            <div v-if="brandDetails">
                <Image :src="brandDetails.logo" alt="Brand Logo" class="mb-4" width="250" preview />
                <p class="font-semibold">Brand: <span class="font-normal">{{ brandDetails.brand }}</span></p>
                <p class="font-semibold">Description: <span class="font-normal">{{ brandDetails.description
                        }}</span>
                </p>
                <p class="font-semibold">Website: <a :href="brandDetails.website" target="_blank"
                        class="text-primary">{{
                            brandDetails.website }}</a></p>
            </div>
            <div v-else>
                <p>Loading...</p>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Button from 'primevue/button';
import Image from 'primevue/image';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const route = useRoute();
const sensor = ref({});
const showBrandDetails = ref(false);
const brandDetails = ref(null);

const fetchSensorData = async (model) => {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/lab240/napi-catalog/refs/heads/main/catalog.json');
        const catalog = response.data;
        for (const brand in catalog) {
            if (catalog[brand].meta) {
                for (const modelKey in catalog[brand]) {
                    if (catalog[brand][modelKey].meta && catalog[brand][modelKey].meta.model === model) {
                        sensor.value = {
                            brand: catalog[brand].meta.vendor || brand,
                            model: catalog[brand][modelKey].meta.model,
                            description: catalog[brand][modelKey].meta.description,
                            documentation: catalog[brand][modelKey].meta.documentation,
                            image_url: catalog[brand][modelKey].meta.image_url,
                            readme: catalog[brand][modelKey].meta.readme,
                            tags: catalog[brand][modelKey].meta.tags || [],
                            url: catalog[brand][modelKey].meta.url,
                            files: Object.keys(catalog[brand][modelKey]).reduce((acc, key) => {
                                if (key !== 'meta') {
                                    acc[key] = {
                                        ...catalog[brand][modelKey][key],
                                        files: catalog[brand][modelKey][key].files.map(file => ({
                                            ...file,
                                            version: extractVersion(file.name)
                                        }))
                                    };
                                }
                                return acc;
                            }, {})
                        };
                        brandDetails.value = catalog[brand].meta;
                        return;
                    }
                }
            }
        }
        sensor.value = {};
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        sensor.value = {};
    }
};

const setTagColor = (tag) => {
    const tagColors = {
        'snmp': 'info',
        'modbus rtu': 'success',
        'modbusrtu': 'success',
        'modbus tcp': 'warn',
        'modbustcp': 'warn'
    };

    return tagColors[tag.toLowerCase()] || 'secondary';
};

const extractVersion = (fileName) => {
    const versionMatch = fileName.match(/_(\d+\.\d+\.\d+)\.conf$/);
    return versionMatch ? versionMatch[1] : null;
};

const hasVersions = (files) => {
    return files.some(file => extractVersion(file.name) !== null);
};

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
    } catch (error) {
        console.error('Error downloading the file', error)
    }
}

onMounted(() => {
    fetchSensorData(route.params.model);
});

watch(() => route.params.model, (newModel) => {
    fetchSensorData(newModel);
});
</script>
