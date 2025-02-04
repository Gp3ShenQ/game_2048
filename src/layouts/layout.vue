<template>
  <div class="flex flex-col justify-center items-center gap-4 bg-[#CED0CE] w-screen h-screen text-black">
    <h1 class="font-black text-6xl text-center">2048</h1>
    <div class="flex gap-5">
      <button class="bg-[#475841] px-4 py-2 rounded-xl font-bold text-white cursor-pointer" @click="chooseCell(2)">2 X 2</button>
      <button class="bg-[#475841] px-4 py-2 rounded-xl font-bold text-white cursor-pointer" @click="chooseCell(3)">3 X 3</button>
      <button class="bg-[#475841] px-4 py-2 rounded-xl font-bold text-white cursor-pointer" @click="chooseCell(4)">4 X 4</button>
      <button class="bg-[#475841] px-4 py-2 rounded-xl font-bold text-white cursor-pointer" @click="chooseCell(gameType)">重新開始</button>
    </div>
    <div class="flex flex-col gap-5 bg-white p-5 rounded-2xl w-full max-w-[600px] h-[600px]">
      <template v-for="(row, index) in grid" :key="index">
        <div class="flex gap-5 h-full">
          <template v-for="(item, itemIndex) in row" :key="itemIndex">
            <div class="flex justify-center items-center rounded-2xl w-full h-full" :style="{ backgroundColor: changeColor(item) }">
              <p class="font-black text-4xl">
                {{ item === 0 ? '' : item }}
              </p>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const gameType = ref(2)

// 根據遊戲類型動態生成網格
const generateEmptyGrid = (size: number) => {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

const changeColor = (item: number) => {
  switch (item) {
    case 0:
      return '#E6E8E6'
    case 2:
      return '#CED0CE'
    case 4:
      return '#9FB8AD'
    case 8:
      return '#83A094'
    case 16:
      return '#658778'
    case 32:
      return '#597F6F'
    case 64:
      return '#486E5D'
    case 128:
      return '#37584A'
    case 256:
      return '#479573'
    case 512:
      return '#42AE7F'
    case 1024:
      return '#2FBD7F'
    case 2048:
      return '#28C481'
    default:
      return '#00E984'
  }
}

// 初始化網格
const grid = ref(generateEmptyGrid(gameType.value))

const chooseCell = (size: number) => {
  gameType.value = size
  grid.value = generateEmptyGrid(size)
  initializeGame()
}

// 生成隨機數字的方法
const generateRandomNumber = () => {
  const emptyCells = []
  for (let i = 0; i < gameType.value; i++) {
    for (let j = 0; j < gameType.value; j++) {
      if (grid.value[i][j] === 0) {
        emptyCells.push([i, j])
      }
    }
  }
  if (emptyCells.length > 0) {
    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    grid.value[x][y] = 2
  }
}

// 初始化遊戲的方法
const initializeGame = () => {
  generateRandomNumber()
  generateRandomNumber()
}

const handleKeyPress = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowUp':
      moveUp()
      break
    case 'ArrowDown':
      moveDown()
      break
    case 'ArrowLeft':
      moveLeft()
      break
    case 'ArrowRight':
      moveRight()
      break
  }
  generateRandomNumber()
}

const moveLeft = () => {
  for (let i = 0; i < grid.value.length; i++) {
    let row = grid.value[i].filter((num) => num)
    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2
        row[j + 1] = 0
      }
    }
    row = row.filter((num) => num)
    while (row.length < gameType.value) {
      row.push(0)
      console.log('moveLeft', row)
    }
    grid.value[i] = row
  }
}

const moveRight = () => {
  for (let i = 0; i < grid.value.length; i++) {
    let row = grid.value[i].filter((num) => num)
    for (let j = row.length - 1; j > 0; j--) {
      if (row[j] === row[j - 1]) {
        row[j] *= 2
        row[j - 1] = 0
      }
    }
    row = row.filter((num) => num)
    while (row.length < gameType.value) {
      row.unshift(0)
      console.log(row)
    }
    grid.value[i] = row
  }
}

const moveUp = () => {
  for (let col = 0; col < gameType.value; col++) {
    let column = []
    for (let row = 0; row < gameType.value; row++) {
      if (grid.value[row][col] !== 0) {
        column.push(grid.value[row][col])
      }
    }
    for (let row = 0; row < column.length - 1; row++) {
      if (column[row] === column[row + 1]) {
        column[row] *= 2
        column[row + 1] = 0
      }
    }
    column = column.filter((num) => num)
    while (column.length < gameType.value) {
      column.push(0)
      console.log('moveUp-column', column)
    }
    for (let row = 0; row < gameType.value; row++) {
      grid.value[row][col] = column[row]
      console.log('moveUp-grid', grid.value)
    }
  }
}

const moveDown = () => {
  for (let col = 0; col < gameType.value; col++) {
    let column = []

    // 先提取非零數字，保持順序（從上往下）
    for (let row = 0; row < gameType.value; row++) {
      if (grid.value[row][col] !== 0) {
        column.push(grid.value[row][col])
      }
    }

    // 處理合併
    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1]) {
        column[i] *= 2
        column[i - 1] = 0 // 標記為已合併
      }
    }

    // 移除 `0`，確保數字往下對齊
    column = column.filter((num) => num !== 0)

    // 在上方補 0，使總數保持 gameType.value
    while (column.length < gameType.value) {
      column.unshift(0)
    }

    // 更新 grid
    for (let row = 0; row < gameType.value; row++) {
      grid.value[row][col] = column[row]
    }
  }
}

// 當組件掛載時初始化遊戲
onMounted(() => {
  initializeGame()
  window.addEventListener('keydown', handleKeyPress)
})
</script>
