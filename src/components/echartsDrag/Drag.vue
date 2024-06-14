<template>
  <div class="drag-container">
    <div class="aaa">
      <VueDraggable id="reset-default"
        class="flex justify-center items-center gap-2 p-4 w-100% h-50px bg-gray-500/30 rounded overflow-hidden"
        v-model="dataAbout.reset" :animation="150" :sort="false" ghostClass="ghost" group="people1" :disabled="true"
        :scroll="false">
        <span id="reset-default-span">Reset Default</span>
      </VueDraggable>
      <VueDraggable v-for="(data, index) in dataAbout.list" :key="data.key" v-show="data.value.length > 0"
        class="flex flex-col gap-2 p-4 h-150px bg-gray-500/5 rounded overflow-auto"
        v-model="dataAbout.list[index].value" :animation="150" :sort="false" ghostClass="ghost" group="people"
        @update="onUpdate" @add="onAdd" @start="onStart" @end="onEnd" @remove="remove" @sort="sore" @move="move" >
        <div v-for="item in dataAbout.list[index].value" :key="item.id"
          class="cursor-move h-5 line-height-5 bg-gray-500/5 rounded pl-3 text-3.5">
          {{ item.name }}
        </div>
      </VueDraggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

const emit = defineEmits(['update']);

const dataAbout = reactive({
  reset: [{ name: 'xxx-0', id: '0' }],
  list: [
    { key: '1', value: [{ name: 'coao-1', id: '1' }] },
    { key: '2', value: [{ name: 'Jean-2', id: '2' }] },
    { key: '3', value: [{ name: 'Johanna-3', id: '3' }] },
    { key: '4', value: [{ name: 'Juan-4', id: '4' }] },
    { key: '5', value: [{ name: 'Zhang-5', id: '5' }] },
    { key: '6', value: [{ name: 'Jiang-6', id: '6' }] },
    { key: '7', value: [{ name: 'Tao-7', id: '7' }] },
    { key: '8', value: [{ name: 'Nino-8', id: '8' }] },
  ]
});


function move(e: any) {
  // console.log('move', e);
  // e.dragged.style.opacity = '0';
  // return false;

}

function sore(e: any) {
  // console.log('sort')
  // return false;
}

function onUpdate() {
  console.log('update')
}
function onAdd(e: any) {
  // console.log('add')
  sortEnd(e);
}
function remove() {
  // console.log('remove')
}

const onStart = (e: any) => {
  // console.log('start');
}
const onEnd = (e: any) => {
  // console.log('end');
  // console.log('end', e);
  if (dragResetDefaultFlag(e)) {
    resetDefault(e);
  } else {
    adjustOrder();
  }
  emit('update', JSON.parse(JSON.stringify(dataAbout.list))); // 发送更新数据事件
}

/**
 * 在拖动Add时，找到拖动的元素所在的数组，并将该元素拖动到数组的最后
 * @param e 事件对象
 */
const sortEnd = (e: any) => {
  // console.log('sortEnd');
  const listData: Array<any> = JSON.parse(JSON.stringify(dataAbout.list)); // 深拷贝
  // 拖动的元素数据
  let dragData: any = {};
  const dragText = e.item.innerText; // 拖动的元素文本
  // 处理数据, 找到拖动的元素，拖动到数组最后
  handleData: for (let i = 0; i < listData.length; i++) {
    let itemArray = listData[i].value;
    for (let j = 0; j < itemArray.length; j++) {
      if (dragText === itemArray[j].name && j !== itemArray.length - 1) {
        const data = itemArray[j];
        itemArray.splice(j, 1);
        itemArray.push(data);
        break handleData;
      }
    }
  }
  dataAbout.list = listData;
}

/**
 * 调整顺序，确保列表中的第一个元素和默认列表是对应的。
 * 例如：[{ name: 'xxx-2', id: '2' }, { name: 'xxx-1', id: '1' }]列表，该列表就应该在总list数组中的第二个位置
 */
const adjustOrder = () => {
  let listData = dataAbout.list;
  // 注意：这里需要拷贝两次，然后整理最终的数据，再赋值给dataAbout.list，
  //（先循环清空响应式数据，再循环赋值会导致顺序出现问题，原因是两个for循环同时执行，响应式数据渲染出现问题）
  // 猜测v-if可能会解决这个问题，没有尝试，因为在这里v-if和v-for在一起使用会有问题，同时频繁的v-if切换会影响性能
  const copyData1: Array<any> = JSON.parse(JSON.stringify(listData)); // 深拷贝
  const copyData2: Array<any> = JSON.parse(JSON.stringify(listData)); // 深拷贝
  // console.log(listData);
  // console.log(copyData1);

  copyData1.forEach(item => item.value.length = 0); // 模拟清空
  copyData2.forEach((itemArray: any, index: number) => {
    if (itemArray.value.length === 0) return;
    copyData1.forEach(item => {
      if (item.key === itemArray.value[0].id) {
        item.value.push(...itemArray.value);
      }
    });
  });
  listData = copyData1;
}

// 判断是否拖动到重置框中
const dragResetDefaultFlag = (e: any) => {
  let flag = true; // 标识，默认是true，表示拖动到重置框中
  const id = e.originalEvent.toElement.id;
  const idArray: Array<string> = ['reset-default', 'reset-default-span'];
  if (!id || !idArray.includes(id)) flag = false; // 没有拖动到重置框中
  return flag;

}

/**
 * 重置默认列表：元素拖动到重置框中，源列表中移除拖动的元素，默认列表中显示拖动的元素
 * @param e 事件对象
 */
const resetDefault = (e: any) => {
  console.log('resetDefault');
  const listData: Array<any> = JSON.parse(JSON.stringify(dataAbout.list)); // 深拷贝
  // 拖动的元素数据
  let dragData: any = {};
  const symbolKeys = Object.getOwnPropertySymbols(e.item);
  symbolKeys.forEach(symbol => {
    dragData = e.item[symbol]; // Symbol(cloneElement), 输出 { name: 'xxx-1', id: '1' }
  });
  // 处理数据
  let originIndex = 0; // 源列表索引，从0开始
  let dragItemIndex = 0; // 拖动的元素索引，从0开始
  // let dragItemId: string = '1'; // 拖动的元素id
  let dragItemNextId: string = '1'; // 拖动的元素后一个元素id
  let newArray = []; // 新的数组
  handleData: for (let i = 0; i < listData.length; i++) {
    let itemArray = listData[i].value;
    for (let j = 0; j < itemArray.length; j++) {
      if (JSON.stringify(dragData) === JSON.stringify(itemArray[j]) && itemArray.length > 1) { // 源列表中最少有两个元素
        const itemArrayCache = JSON.parse(JSON.stringify(itemArray));
        if (j === 0) { // 若拖动的是第一个元素，则将源列表中第二个直至最后一个元素都添加到第二个元素所在的默认列表中
          dragItemNextId = itemArrayCache[1].id;
          originIndex = i;
          dragItemIndex = 0;
          newArray = itemArrayCache.splice(1);
          console.log(itemArray);
          console.log(newArray);
        } else {
          originIndex = i;
          dragItemIndex = j;
          // 源列表中移除拖动的元素
          itemArrayCache.splice(j, 1);
          // 对应的默认列表中显示拖动的元素
          // listData.forEach(item => {
          //   if (item.key === dragData.id) {
          //     item.value.push(dragData);
          //   }
          // });
        }
        break handleData;
      }
    }
  }
  if (dragItemIndex === 0) {
    listData[originIndex].value.splice(1);
    listData.forEach(item => {
      if (item.key === dragItemNextId) {
        item.value.push(...newArray);
      }
    });
  } else {
    listData[originIndex].value.splice(dragItemIndex, 1);
    listData.forEach(item => {
      if (item.key === dragData.id) {
        item.value.push(dragData);
      }
    });
  }
  console.log(listData);
  dataAbout.list = listData;
}
</script>

<style scoped lang="less">
.aaa {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
