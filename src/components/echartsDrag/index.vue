<template>
  <div class='echarts-drag-containter'>
    <div class="drag">
      <Drag @update="update" />
    </div>

    <Echarts :legendShowData="dataAbout.legendShowData" :seriesyAxisIndexData="dataAbout.seriesyAxisIndexData" />
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import Drag from "./Drag.vue";
import Echarts from "./Echartscopy.vue";

const dataAbout = reactive({
  legendShowData: [] as Array<boolean>,
  seriesyAxisIndexData: [] as Array<number>,
});

const update = (data: Array<any>) => {
  // console.log('update');
  const legendShowData = data.map(item => item.value.length > 0); // 只有当有数据时才显示图例
  const seriesyAxisIndexData = new Array(data.length).fill(0);
  data.forEach((item, index) => {
    item.value.forEach((subItem: any, subIndex: number) => {
      seriesyAxisIndexData[+subItem.id - 1] = index;
    });
  });
  dataAbout.legendShowData = legendShowData;
  dataAbout.seriesyAxisIndexData = seriesyAxisIndexData;
}

</script>
<style scoped lang='less'>
@import '@/assets/styles/mixin.less';

.echarts-drag-containter {
  .flex-column();
  gap: 2vh;

  .drag {
    height: 30vh;
    .border-radius();
  }

  .echarts-container {
    height: 400px;
    width: 100%;
    .border-radius();
  }
}
</style>