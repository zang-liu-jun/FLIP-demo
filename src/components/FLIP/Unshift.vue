<script setup lang='ts'>
import { reactive, ref, nextTick } from 'vue';
type Item = {
  id: symbol;
  content: string
}
let content = ref("")
const list: Item[] = reactive([])
const itemContentDiv = ref(null)
async function handleClick() {
  // weakMap的键是弱引用，会自动gc，很适合保存DOM节点
  const wMap: WeakMap<HTMLElement, DOMRect> = new WeakMap()
  const oldItems = (itemContentDiv.value as unknown as HTMLElement).children
  // oldItems是HTMLCollection类型，是类数组，没有数组的函数，所以这里用call
  Array.prototype.forEach.call(oldItems, (item: HTMLElement) => {
    wMap.set(item, item.getBoundingClientRect())
  })

  list.unshift({
    id: Symbol(),
    content: content.value
  })
  content.value = ""
  // 等待dom节点更新以获取最新的dom节点状态
  await nextTick()
  const newItems = (itemContentDiv.value as unknown as HTMLElement).children
  Array.prototype.forEach.call(newItems, (item: HTMLElement) => {
    const startRect = wMap.get(item)
    moveAnime(startRect, item)
  })
}
// FLIP!
function moveAnime(startRect: DOMRect | undefined, target: HTMLElement) {
  if (startRect === undefined) return
  const endRect = target.getBoundingClientRect()
  const invertX = startRect.left - endRect.left
  const invertY = startRect.top - endRect.top
  target.style.transform = `translate(${invertX}px,${invertY}px)`
  requestAnimationFrame(() => {
    target.style.transform = "translate(0,0)"
    target.style.transition = "all 0.5s"
  })
  // 清除动画所需属性
  target.addEventListener("transitionend", () => {
    target.style.transform = ""
    target.style.transition = ""
  })
}
</script>

<template>
  <div>
    <div style="marginBottom:20px">
      <input type="text" v-model="content">
      <button @click="handleClick()">添加</button>
    </div>
    <div class="item-content" ref="itemContentDiv">
      <div class="item" v-for="item in list" :key="item.id">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-content {
  display: flex;
  flex-wrap: wrap;
}

.item {
  width: 200px;
  height: 100px;
  border: 1px solid red;
  margin: 10px;
}
</style>