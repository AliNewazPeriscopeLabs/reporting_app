<script setup>
import { Panel, PanelPosition, VueFlow, useVueFlow } from '@vue-flow/core'
import { nextTick, watch } from 'vue'
import Sidebar from './Sidebar.vue'
import OptionsPen from './OptionsPen.vue'
import { ref } from 'vue'

let tables = ref([])
let id = 0
function getId() {
  return `dndnode_${id++}`
}

const { findNode, onConnect, addEdges, addNodes, project, vueFlowRef, $reset } = useVueFlow({
  nodes: [
    {
      id: '1',
      type: 'input',
      label: 'input node',
      position: { x: 250, y: 25 },
    },
  ],
})

function resetTransform() {
  tables = [];
  $reset()
}
function onDragOver(event) {
  event.preventDefault()

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

onConnect((params) => addEdges(params))

function onDrop(event) {
  const type = event.dataTransfer?.getData('application/vueflow')

  const { left, top } = vueFlowRef.value.getBoundingClientRect()

  const position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  })

  const newNode = {
    id: getId(),
    type,
    position,
    label: `${type} node`,
  }

  addNodes([newNode])

  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(newNode.id)
    const stop = watch(
      () => node.dimensions,
      (dimensions) => {
        if (dimensions.width > 0 && dimensions.height > 0) {
          node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
          stop()
        }
      },
      { deep: true, flush: 'post' },
    )
    console.log(node);
  })
}
</script>

<template>
  <div class="dndflow" @drop="onDrop">
    <Sidebar />
    <div class="d-flex flex-column justify-content-center align-items-center w-100" style="height: 100vh;">
      <VueFlow v-model="tables" @dragover="onDragOver" >
        <Panel :position="PanelPosition.TopRight" class="controls">
            <button style="background-color: #113285; color: white" title="Reset Transform" @click="resetTransform">
                <svg width="16" height="16" viewBox="0 0 32 32">
                <path fill="#FFFFFB" d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z" />
                </svg>
            </button>
        </Panel>
      </VueFlow>
      <OptionsPen />
    </div>
  </div>
</template>
<style scoped>
    
</style>