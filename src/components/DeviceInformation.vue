<template>
    <div v-if="props.device" class="w-full p-10">
        <!-- <div class="flex justify-end ">
            <Button @click="sendMessage" icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" />
        </div> -->
        <Card style="width: auto; ">
            <template #header>
                <h4 class="p-5 text-2xl">{{ catalog.brand.toUpperCase() }}</h4>
                <!-- <Accordion>
                    <AccordionPanel value="0">
                        <AccordionHeader>{{ catalog.brand.toUpperCase() }}</AccordionHeader>
                    </AccordionPanel>
                </Accordion> -->
                <div v-if="catalog.meta.image_url" class="card flex justify-center">
                    <Image alt="Not Image" preview>
                        <template #previewicon>
                            <i class="pi pi-search"></i>
                        </template>
                        <template #image>
                            <img :src="catalog.meta.image_url" alt="Not Image" width="500" />
                        </template>
                        <template #preview="slotProps">
                            <img :src="catalog.meta.image_url" alt="preview" :style="slotProps.style"
                                @click="slotProps.onClick" />
                        </template>
                    </Image>
                </div>
            </template>
            <template #title>
                <Button style="font-size: larger;" as="a" :label="catalog.model.name" target="_blank" rel="noopener"
                    :href="catalog.meta.url" link />
            </template>
            <template #subtitle>
                {{ catalog.meta.description }}
            </template>
            <template #content>
                <Accordion :value="['0']" multiple>
                    <AccordionPanel v-if="catalog.snmp.length > 0" value="0">
                        <AccordionHeader>SNMP</AccordionHeader>
                        <AccordionContent>
                            <Button v-for="(snmp, index) in catalog.snmp" v-bind:key="index" style="font-size: larger;"
                                as="a" :label="snmp.name" target="_blank" rel="noopener" :href="snmp.url" link />
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel v-if="catalog.dashboard.length > 0" value="2">
                        <AccordionHeader>Dashboard</AccordionHeader>
                        <AccordionContent>

                            <Button v-for="(dashboard, index) in catalog.dashboard" v-bind:key="index"
                                style="font-size: larger;" as="a" :label="`${catalog.model.name}  ${dashboard.name}`"
                                target="_blank" rel="noopener" :href="dashboard.url" link />
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </template>
            <template #footer>
                <div class="flex justify-start gap-4 m-5">
                    <Button style="color: black;" label="Read me" size="large" as="a" icon="pi pi-github" text raised
                        :href="catalog.meta.readme" />
                    <Button text raised size="large" as="a" icon="pi pi-upload" style="color:blueviolet;"
                        :href="catalog.meta.documentation" />

                </div>
            </template>
        </Card>
        <!-- </AccordionContent>
            </AccordionPanel>

        </Accordion> -->
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    device: Object
});

const emit = defineEmits(['closeWindowAboutDevice']);
const sendMessage = () => {
    emit('closeWindowAboutDevice');
};

const catalog = ref({});

watch(() => props.device, (newDevice) => {
    if (newDevice) {
        if (newDevice.snmp.files) {

            const snmp = []
            newDevice.snmp.files.forEach((el) => {
                const snmpSplitData = el.name.split('_');

                const snmpFormat = snmpSplitData[snmpSplitData.length - 1].replace('.conf', '');
                snmp.push({
                    name: snmpFormat,
                    url: el.url
                })
            })

            newDevice.snmp = snmp
        }
        if (newDevice.dashboard.files) {

            const dashboard = []
            newDevice.dashboard.files.forEach((el) => {
                const dashboardSplitData = el.name.split('-');

                const dashboardFormat = dashboardSplitData[dashboardSplitData.length - 1].replace('.json', '');
                dashboard.push({
                    name: dashboardFormat,
                    url: el.url
                })
            })

            newDevice.dashboard = dashboard
        }

        console.log(newDevice)
        catalog.value = newDevice
    }
});



</script>
