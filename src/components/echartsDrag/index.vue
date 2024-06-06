<template>
  <div class='echarts-drag-containter'>
    <div class="drag">
      <Drag />
    </div>
    
    <Echarts />
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import Drag from "./Drag.vue";
import Echarts from "./Echarts.vue";

</script>
<style scoped lang='less'>
@import '@/assets/styles/mixin.less';

.echarts-drag-containter {
  .flex-column();
  gap: 2vh;

  .drag {
    // width: 100%;
    height: 20vh;
    .border-radius();
  }
  .echarts-container {
    width: 100%;
    .border-radius();
  }
}
</style>