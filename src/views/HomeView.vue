<script setup lang="ts">
// import TheWelcome from '../components/TheWelcome.vue';
// import EchartsDrag from "@/components/echartsDrag/index.vue";
// import EchartsDrag from "@/components/echartsDrag1/index.vue";
// import EchartsDrag from "@/components/echartsDrag2/index.vue";
import Upload from "@/components/upload/index.vue";

const upload = (files: File[]) => {
  console.log("父级-----------------");
  console.log(files);
}
</script>

<template>
    <!-- <EchartsDrag /> -->
    <Upload @upload="upload" class="ml-auto mr-auto mt-1rem" />
</template>
