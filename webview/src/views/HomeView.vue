<template>
	<main class="main-container">
		<CloudMusic></CloudMusic>
	</main>
</template>
<script setup lang="ts">
import type { WorktimeWebviewState } from '../../../shared/protocol';
import CloudMusic from '@/features/cloude-music/index.vue'
defineProps<{
	state: WorktimeWebviewState;
	status: 'booting' | 'connected';
}>();
</script>