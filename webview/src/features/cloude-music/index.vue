<template>
    <section class="cloud-music-page">
        <div class="ambient-grid" aria-hidden="true"></div>
        <div class="ambient-disc ambient-disc--primary" aria-hidden="true"></div>
        <div class="ambient-disc ambient-disc--accent" aria-hidden="true"></div>
        <loginCard />
    </section>
</template>

<script lang="ts" setup>
import loginCard from './components/loginCard.vue';
</script>

<style scoped src="./index.css" lang="scss"></style>
