<script setup>
function onDragStart(event, nodeType) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<template>
  <aside>
    <div class="description text-secondary">You can drag these nodes to the pane.</div>

    <!-- <div class="nodes">
      <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'input')">Input Node</div>

      <div class="vue-flow__node-default" :draggable="true" @dragstart="onDragStart($event, 'default')">Default Node</div>

      <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'output')">Output Node</div>
    </div> -->
    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item mb-2">
        <h2 class="accordion-header" id="flush-headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            Tables
          </button>
        </h2>
        <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
          <div class="nodes p-4">
            <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'Table One')">Table One</div>

            <div class="vue-flow__node-default" :draggable="true" @dragstart="onDragStart($event, 'Table Two')">Table Two</div>

            <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'Tables Three')">Tables Three</div>
          </div>
        </div>
      </div>
      <div class="accordion-item mb-2">
        <h2 class="accordion-header" id="flush-headingTwo">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseOTwo">
            Views
          </button>
        </h2>
        <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
          <div class="nodes p-4">
            <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'Table One')">View One</div>

            <div class="vue-flow__node-default" :draggable="true" @dragstart="onDragStart($event, 'Table Two')">View Two</div>

            <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'Tables Three')">View Three</div>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingThree">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
            Data Models
          </button>
        </h2>
        <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
          <div class="d-flex flex-column justify-content-center align-items-center p-4">
            <button type="button" class="btn-style btn btn-outline-light text-secondary mb-2 w-100">Data Model 1</button>
            <button type="button" class="btn-style btn btn-outline-light text-secondary mb-2 w-100">Data Model 2</button>
            <button type="button" class="btn-style btn btn-outline-light text-secondary mb-2 w-100">Data Model 3</button>
            <button type="button" class="btn-style btn btn-outline-light text-secondary mb-2 w-100">Data Model 4</button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>