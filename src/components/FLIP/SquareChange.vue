<script setup lang='ts'>
import { ref, reactive, nextTick } from "vue"
import { getRandomColor, shuffle } from "./util"

const boxesRef = ref<Array<HTMLDivElement> | null>(null)
const boxArr = reactive<{ id: symbol, color: string }[]>([])

boxInit(3)


function handleUnshift() {
  const newBox = {
    id: Symbol(),
    color: getRandomColor()
  }
  handleAnimation(() => {
    boxArr.unshift(newBox)
  })
}

function handleShift() {
  handleAnimation(() => {
    boxArr.shift()
  })
}

function handleShuffle() {
  handleAnimation(() => {
    shuffle(boxArr)
  })
}

async function handleAnimation(update: () => void) {
  if (boxesRef.value == null) return;
  const oldRectMap = getRectMap();

  update()
  await nextTick()
  const currRectMap = getRectMap()
  oldRectMap.forEach((oldRect, ele) => {
    const currRect = currRectMap.get(ele)
    if (!currRect) return;
    const invert = {
      left: oldRect.left - currRect.left,
      top: oldRect.top - currRect.top
    }
    const keyframes = [
      {
        transform: `translate(${invert.left}px,${invert.top}px)`
      }, {
        transform: `translate(0,0)`
      }
    ]

    const options = {
      duration: 300,
      easing: "cubic-bezier(0,0,0.32,1)",
    }
    const animation = ele.animate(keyframes, options)

  })

  function getRectMap() {
    const map = new Map<HTMLDivElement, DOMRect>()
    boxesRef.value!.forEach(boxEle => {
      map.set(boxEle, boxEle.getBoundingClientRect())
    })
    return map
  }
}


function boxInit(cnt: number) {
  for (let i = 0; i < cnt; i++) {
    boxArr.push({ id: Symbol(), color: getRandomColor() })
  }
}


</script>

<template>
  <div class="squareChange">
    <div class="controlBox">
      <div class="btnBox">
        <button @click="handleUnshift">unshift</button>
        <button @click="handleShift">shift</button>
        <button @click="handleShuffle">shuffle</button>
      </div>
    </div>
    <div class="contentBox">
      <div class="box" v-for="item in boxArr" :key="item.id" :style="{ backgroundColor: item.color }" ref="boxesRef">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.squareChange {
  width: 100%;
  height: 4000px;


  .controlBox {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 100%;

    .btnBox {
      display: flex;
      width: 40%;
      justify-content: space-around;
    }
  }

  .contentBox {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .box {
      width: 250px;
      height: 200px;
      border-radius: 5px;
      margin: 10px;
    }
  }
}
</style>