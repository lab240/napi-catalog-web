<template>
  <div class="flex flex-col items-center min-h-screen">
    <Card class="w-96">
      <template #title>
        <h1 class="text-2xl font-bold">{{ $t('welcome.header') }}</h1>
      </template>
      <template #content>
        <div class="p-4">
          <p class="mb-4">{{ $t('welcome.description') }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>
