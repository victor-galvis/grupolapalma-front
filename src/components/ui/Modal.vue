<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>
        <div
          class="relative w-full max-w-lg rounded-2xl shadow-2xl z-10 p-6"
          :style="{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-serif font-semibold" :style="{ color: 'var(--color-text)' }">{{ title }}</h3>
            <button @click="$emit('update:modelValue', false)" :style="{ color: 'var(--color-muted)' }" class="hover:opacity-70">
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
defineProps({ modelValue: Boolean, title: String })
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
