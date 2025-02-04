<template>
  <div class="flex flex-col justify-center items-center gap-4 bg-[#A9D3C1] w-screen h-screen text-black">
    <h1 class="font-black text-6xl text-center">2048</h1>
    <div class="flex gap-5">
      <button class="bg-[#475841] px-4 py-2 rounded-xl font-bold text-white cursor-pointer" @click="chooseCell(2)">2 X 2</button>
      <button class="bg-[#475841] px-4 py-2 rounded-xl font-bold text-white cursor-pointer" @click="chooseCell(3)">3 X 3</button>
      <button class="bg-[#475841] px-4 py-2 rounded-xl font-bold text-white cursor-pointer" @click="chooseCell(4)">4 X 4</button>
      <button class="bg-[#475841] px-4 py-2 rounded-xl font-bold text-white cursor-pointer" @click="chooseCell(gameType, 'reset')">重新開始</button>
    </div>
    <div class="flex flex-col gap-5 bg-white p-5 rounded-2xl w-full max-w-[600px] h-[600px] max-[412px]:h-[400px] max-[512px]:h-[500px]">
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

<script setup>
import { ref, onMounted } from 'vue'

import Swal from 'sweetalert2'

const gameType = ref(2)
const onceCheck = ref(0)

// 根據遊戲類型動態生成網格
const generateEmptyGrid = (size) => {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

const changeColor = (item) => {
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

const chooseCell = (size, reset) => {
  if (reset === 'reset') {
    onceCheck.value = 0
  }
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

const gameOverBox = () => {
  if (onceCheck.value === 0) {
    Swal.fire({
      text: '已經沒有可移動',
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: '從新開始',
      buttonsStyling: false,
    }).then(() => {
      onceCheck.value = 1
      chooseCell(gameType.value, 'reset')
    })
  }
}

const handleKeyPress = (event) => {
  const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
  if (allowedKeys.includes(event.key)) {
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
    }
    grid.value[i] = row
    const _result = checkMove()
    if (_result) {
      gameOverBox()
    }
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
    }
    grid.value[i] = row
    const _result = checkMove()
    if (_result) {
      gameOverBox()
    }
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
    }
    for (let row = 0; row < gameType.value; row++) {
      grid.value[row][col] = column[row]
      const _result = checkMove()
      if (_result) {
        gameOverBox()
      }
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
      const _result = checkMove()
      if (_result) {
        gameOverBox()
      }
    }
  }
}

const checkMove = () => {
  const size = grid.value.length

  // 檢查空格
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid.value[i][j] === 0) {
        return false
      }
    }
  }

  // 檢查相鄰格子
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // 檢查右邊相鄰格子
      if (j < size - 1 && grid.value[i][j] === grid.value[i][j + 1]) {
        return false
      }
      // 檢查下方相鄰格子
      if (i < size - 1 && grid.value[i][j] === grid.value[i + 1][j]) {
        return false
      }
    }
  }
  return true
}

// 當組件掛載時初始化遊戲
onMounted(() => {
  initializeGame()
  window.addEventListener('keydown', handleKeyPress)
})
</script>

<style lang="scss">
.swal2-popup {
  background: linear-gradient(325deg, #c6ebc6 0%, rgb(174, 214, 198) 100%, #b4d3b4 50%);
  color: #635f5f;
}

.swal2-confirm {
  width: auto;
  padding-inline: 10px;
  margin-inline: 10px;
  height: 40px;
  cursor: pointer;
  min-width: 100px;
  font-size: 16px;
  text-align: center;
  transition: 0.8s;
  background-size: 280% auto;
  background-image: linear-gradient(325deg, rgb(204, 236, 224) 0%, rgb(174, 214, 198) 55%, rgb(26, 158, 105) 90%);
  border: none;
  border-radius: 30px;
  color: hsla(360 100% 100% / 1);
  box-shadow:
    0px 0px 5px rgb(174, 214, 198, 0.5),
    0px 5px 5px -1px rgba(32, 105, 76, 0.25),
    inset 1px 4px 8px rgba(66, 224, 161, 0.5),
    inset -4px -4px 8px rgba(81, 109, 98, 0.35);
  font-weight: bold;
  border: none;
  background-color: transparent;
}

.swal2-confirm:hover {
  background-color: transparent;
  color: rgb(3, 85, 47);
}

.swal2-confirm:is(:focus, :focus-visible, :active) {
  background-color: transparent;
  outline: none;
  box-shadow:
    0 0 0 3px rgb(241, 229, 229),
    0 0 0 6px #d8cdc8;
  color: rgb(3, 85, 47);
}

.swal2-deny {
  width: auto;
  padding-inline: 10px;
  margin-inline: 10px;
  height: 40px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  transition: 0.8s;
  background-size: 280% auto;
  background-image: linear-gradient(325deg, #eee1dc 0%, rgb(231, 206, 194) 55%, #aa9389 90%);
  border: none;
  border-radius: 30px;
  color: hsla(360 100% 100% / 1);
  box-shadow:
    0px 0px 5px rgba(255, 114, 71, 0.5),
    0px 5px 5px -1px rgba(233, 122, 58, 0.25),
    inset 4px 4px 8px rgba(255, 214, 175, 0.5),
    inset -4px -4px 8px rgba(216, 81, 19, 0.35);
  font-weight: bold;
  border: none;
}

.swal2-deny:hover {
  background-position: right top;
  color: #9b8b84;
}

.swal2-styled:hover {
  background: transparent;
}

.swal2-deny:is(:focus, :focus-visible, :active) {
  outline: none;
  box-shadow:
    0 0 0 3px hsla(360 100% 100% / 1),
    0 0 0 6px #9b8b84;
  color: #635f5f;
}

.swal2-icon {
  border: none;
}
</style>
