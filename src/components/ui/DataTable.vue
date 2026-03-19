<template>
  <div class="overflow-x-auto rounded-xl" :style="{ border: '1px solid var(--color-border)' }">
    <table class="w-full text-sm">
      <thead>
        <tr :style="{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }">
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-left font-medium"
            :style="{ color: 'var(--color-muted)' }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in data"
          :key="i"
          class="transition-colors duration-150"
          :style="{ borderBottom: '1px solid var(--color-border)' }"
          @mouseenter="hoveredRow = i"
          @mouseleave="hoveredRow = null"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3"
            :style="{
              color: 'var(--color-text)',
              background: hoveredRow === i ? 'var(--color-border)' : 'var(--color-surface)'
            }"
          >
            <slot :name="col.key" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="!data?.length">
          <td :colspan="columns.length" class="px-4 py-8 text-center" :style="{ color: 'var(--color-muted)', background: 'var(--color-surface)' }">
            Sin datos
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const hoveredRow = ref(null)
defineProps({
  columns: Array,
  data: Array,
})
</script>
