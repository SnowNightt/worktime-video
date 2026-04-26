<script setup lang="ts">
import type { WorktimeWebviewState } from '../../../shared/protocol';


defineProps<{
	state: WorktimeWebviewState;
	status: 'booting' | 'connected';
}>();
</script>

<template>
	<main class="home">
		home1
	</main>
</template>
