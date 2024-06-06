<template>
  <div class="drag-container flex justify-center">
    <VueDraggable v-show="list1.length > 0" class="flex flex-col gap-2 p-4 w-150px h-150px bg-gray-500/5 rounded overflow-auto"
      v-model="list1" :animation="150" ghostClass="ghost" group="people" @update="onUpdate" @add="onAdd"
      @remove="remove">
      <div v-for="item in list1" :key="item.id" class="cursor-move h-5 line-height-5 bg-gray-500/5 rounded pl-3 text-3.5">
        {{ item.name }}
      </div>
    </VueDraggable>
    <VueDraggable v-show="list2.length > 0" class="flex flex-col gap-2 p-4 w-150px h-150px m-auto bg-gray-500/5 rounded overflow-auto"
      v-model="list2" :animation="150" group="people" ghostClass="ghost" @update="onUpdate" @add="onAdd"
      @remove="remove">
      <div v-for="item in list2" :key="item.id" class="cursor-move h-5 line-height-5 bg-gray-500/5 rounded pl-3 text-3.5">
        {{ item.name }}
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
const list1 = ref([
  {
    name: 'coao-1',
    id: '1'
  },
  {
    name: 'Jean',
    id: '2'
  },
  {
    name: 'Johanna',
    id: '3'
  },
  {
    name: 'Juan',
    id: '4'
  }
])
const list2 = ref(
  list1.value.map(item => ({
    name: `${item.name}-2`,
    id: `${item.id}-2`
  }))
)
function onUpdate() {
  console.log('update')
}
function onAdd() {
  console.log('add')
}
function remove() {
  console.log('remove')
}
</script>

<style>

</style>
