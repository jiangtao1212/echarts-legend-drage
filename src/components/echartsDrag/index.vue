<template>
  <div class='echarts-drag-containter'>
    <input type="button" @click="addLegendData" value="add legend" />
    <div class="drag">
      <Drag :data="dataAbout.legendData" @update="update" />
    </div>

    <Echarts :legendShowData="dataAbout.legendShowData" :seriesyAxisIndexData="dataAbout.seriesyAxisIndexData" />
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue';
import Drag from "./Drag.vue";
import Echarts from "./Echartscopy copy.vue";

const dataAbout = reactive({
  legendData: [] as Array<string>,
  legendShowData: [] as Array<boolean>,
  seriesyAxisIndexData: [] as Array<number>,
});

// 拖拽更新数据
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

const addLegendData = () => {
  dataAbout.legendData.push(`new-${dataAbout.legendData.length + 1}`);

  // 这里是为了解决数组地址不变化导致子组件watch监听的新值和旧值一直不变的问题
  // 但是这样做会导致数据更新时，子组件重新渲染，导致页面卡顿，所以这里暂时不采用这种方式
  // dataAbout.legendData = JSON.parse(JSON.stringify(dataAbout.legendData));
  // dataAbout.legendData.push(`new-${dataAbout.legendData.length + 1}`);
}

// 初始化模拟数据
const initData = () => {
  setTimeout(() => {
    // dataAbout.legendData = ['coao-1', 'Jean-2', 'Johanna-3', 'Juan-4', 'Zhang-5', 'Jiang-6', 'Tao-7', 'Nino-8'];
    dataAbout.legendData = ['coao-1'];
  }, 200);
}


onMounted(() => {
  initData();
});

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