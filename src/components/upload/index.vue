<template>
  <div class="upload-container">
    <p class="drag-text">
      <el-icon :size="20" color="#9f9d9d">
        <Upload />
      </el-icon>
      将文件或文件夹拖到此处
    </p>
    <p class="drag-text">支持的文件类型：.jpg | .jpeg | .bmp | .webp | .gif | .png</p>
    <p class="drag-text">每个文件允许的最大尺寸：2M</p>
    <p class="drag-text">
      <span>点击</span>
      <label for="upload-files">上传文件</label>
      <input id="upload-files" type="file" style="display: none" multiple accept=".jpg,.jpeg,.bmp,.webp,.gif,.png" />

      <span>或</span>

      <label for="upload-directories">上传文件夹</label>
      <input id="upload-directories" type="file" style="display: none" multiple webkitdirectory mozdirectory odirectory
        directory />
    </p>
  </div>
</template>

<script setup lang="ts">
import { Upload } from "@element-plus/icons-vue";
import { onMounted, onUnmounted } from "vue";

const emits = defineEmits(["upload"]);

let dragContainer: HTMLDivElement | null = null; // 拖拽区域
let uploadFilesBtn: Element | null = null; // 上传文件按钮
let uploadDirectoriesBtn: Element | null = null; // 上传文件夹按钮

// 获取文件--按钮点击事件
const getFiles = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  console.log(files);
}

// 获取文件夹中的所有文件--按钮点击事件
const getDirectories = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  console.log(files);
}

// 异步获取文件夹中的所有文件----迭代器
const getDirectorieFiles = async (entry: FileSystemDirectoryEntry) => {
  const files: File[] = [];
  const reader = entry.createReader();
  const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });
  for (const entry of entries) {
    if (entry.isDirectory) {
      const subFiles = await getDirectorieFiles(entry as FileSystemDirectoryEntry);
      files.push(...subFiles);
    } else {
      const file = await getFilesFromFileEntry(entry as FileSystemFileEntry);
      files.push(file);
    }
  }
  return files;
}

// 异步获取拖动的文件
const getFilesFromFileEntry = async (entry: FileSystemFileEntry): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    entry.file(resolve, reject);
  });
}

// 获取拖动的文件和文件夹中所有文件信息
const getDragfilesAndDirectories = async (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  const items = e?.dataTransfer?.items;
  if (!items) return;
  let filesArray: File[] = [];
  // 用于存储所有异步操作的 promise
  // 注：这里必须使用promise数组,因为for循环中使用await会阻塞后续代码执行
  // 而Promise.all()方法可以同时执行多个promise,并返回一个promise数组
  // 例如：拖动一个文件夹和两个文件，当先执行文件夹的异步操作时，后续for循环就不执行了。
  const promises: Promise<void>[] = [];
  for (const item of items) {
    // console.log(item);
    const entry = item.webkitGetAsEntry();
    // console.log(entry);
    if (entry?.isDirectory) { // 如果是文件夹
      console.log("is directory");
      const promise = getDirectorieFiles(entry as FileSystemDirectoryEntry).then(files => {
        filesArray.push(...files);
      });
      promises.push(promise);
    } else { // 如果是文件
      console.log("is file");
      const promise = getFilesFromFileEntry(entry as FileSystemFileEntry).then(file => {
        filesArray.push(file);
      });
      promises.push(promise);
    }
  }
  await Promise.all(promises);
  console.log("All files processed:", filesArray);
  emits('upload', filesArray);
}

// 初始化文件或文件夹拖拽事件监听
const initDragListener = () => {
  dragContainer = document.querySelector(".upload-container");

  dragContainer?.addEventListener("dragEnter", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  dragContainer?.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  dragContainer?.addEventListener("drop", getDragfilesAndDirectories);
}


onMounted(() => {
  uploadFilesBtn = document.querySelector("#upload-files");
  uploadFilesBtn?.addEventListener("change", getFiles);

  uploadDirectoriesBtn = document.querySelector("#upload-directories");
  uploadDirectoriesBtn?.addEventListener("change", getDirectories);

  initDragListener();
});

onUnmounted(() => {
  uploadFilesBtn?.removeEventListener("change", getFiles);
  uploadDirectoriesBtn?.removeEventListener("change", getDirectories);
  dragContainer?.removeEventListener("drop", getDragfilesAndDirectories);
});
</script>

<style scoped lang="less">
.upload-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  align-items: center;
  max-height: 20rem;
  min-height: 10rem;
  height: 10rem;
  max-width: 100vw;
  min-width: 30rem;
  width: 30rem;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;

  .drag-text {
    color: #ccc;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 5px;
    --color: #409eff;

    label {
      position: relative;
      color: var(--color);
      cursor: pointer;
    }

    label::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 2px; // 边框高度
      background-color: var(--color); // 边框颜色
      transition: width 0.5s ease; // 过渡效果
    }

    label:hover:after {
      width: 100%;
    }
  }
}
</style>