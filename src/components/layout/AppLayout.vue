<template>
  <div class="flex h-screen overflow-hidden" :style="{ background: 'var(--color-bg)' }">
    <Sidebar role="cliente" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Topbar />
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import { RouterView } from 'vue-router'
</script>
