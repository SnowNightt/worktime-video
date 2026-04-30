<template>
	<HomeView :state="state" :status="status" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type { WorktimeWebviewState } from '../../shared/protocol';
import HomeView from './views/HomeView.vue';
import { extensionBridge } from './services/bridge';
import { getInitialState } from './services/vscode';

const state = ref<WorktimeWebviewState>(getInitialState());

const status = ref<'booting' | 'connected'>('booting');

onMounted(() => {
	extensionBridge.subscribe((message) => {
		if (message.type === 'host/init-state') {
			state.value = message.payload;
			status.value = 'connected';
		}
	});

	extensionBridge.ready();
});
</script>