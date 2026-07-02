<template>
  <Transition name="loading-fade">
    <div
      v-if="visible"
      class="loading-overlay"
      role="status"
      aria-live="polite"
      :aria-label="text"
    >
      <span class="loading-spinner" aria-hidden="true"></span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean;
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: "加载中",
});
</script>

<style scoped>
@reference "../../../styles/tailwind.css";

.loading-overlay {
  @apply absolute inset-0 z-[5] grid place-items-center bg-[rgba(5,8,12,0.16)] p-4 backdrop-blur-[2px];
}

.loading-spinner {
  @apply h-8 w-8 animate-spin rounded-full;

  background: conic-gradient(
    from 0deg,
    var(--page-accent, #61afef),
    rgba(245, 247, 251, 0.18),
    transparent 72%
  );
  -webkit-mask: radial-gradient(circle, transparent 52%, #000 55%);
  mask: radial-gradient(circle, transparent 52%, #000 55%);
  animation-duration: 840ms;
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  @apply transition-opacity duration-150 ease-out;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  @apply opacity-0;
}
</style>
