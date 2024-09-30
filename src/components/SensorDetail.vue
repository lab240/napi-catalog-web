<template>
    <div class="sensor-detail">
        <template v-if="sensor.model">
            <h1>{{ sensor.model }}</h1>
            <p><strong>Brand:</strong> {{ sensor.brand }}</p>
            <p><strong>Tags:</strong></p>
            <ul>
                <li v-for="tag in sensor.tags" :key="tag">{{ tag }}</li>
            </ul>
        </template>
        <template v-else>
            <p>Sensor data not available</p>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const sensor = ref({});

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
                            tags: catalog[brand][modelKey].meta.tags || []
                        };
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

onMounted(() => {
    fetchSensorData(route.params.model);
});

watch(() => route.params.model, (newModel) => {
    fetchSensorData(newModel);
});
</script>
