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
    <!-- <div class="description text-secondary">You can drag these nodes to the pane.</div> -->

    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item mb-2">
        <h2 class="accordion-header" id="flush-headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            Tables
          </button>
        </h2>
        <div id="flush-collapseOne" class="accordion-collapse collapse py-2" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
          <div>
            <div class="nodes p-2 ms-4">
              <button class="vue-flow__node-input btn-style btn btn-outline-light text-dark shadow-none d-flex justify-content-between align-items-center" :draggable="true" @dragstart="onDragStart($event, 'Table One')" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample1" aria-expanded="false" aria-controls="collapseExample1">
                Table One
              </button>
            </div>
            <div class="collapse ms-5 pe-2" id="collapseExample1">
              <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
                Column One
              </button>
              <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
                Column Two
              </button>
              <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
                Column Three
              </button>
            </div>
          </div>
          <div>
            <div class="nodes p-2 ms-4">
              <button class="vue-flow__node-input btn-style btn btn-outline-light text-dark shadow-none d-flex justify-content-between align-items-center" :draggable="true" @dragstart="onDragStart($event, 'Table Two')" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2">
                Table Two
              </button>
            </div>
            <div class="collapse ms-5 pe-2" id="collapseExample2">
              <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
                Column One
              </button>
              <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
                Column Two
              </button>
              <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
                Column Three
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="accordion-item mb-2">
        <h2 class="accordion-header" id="flush-headingTwo">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
            Views
          </button>
        </h2>
        <div id="flush-collapseTwo" class="accordion-collapse collapse py-2" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
          <div class="nodes p-2 ms-4">
            <button class="vue-flow__node-input btn-style btn btn-outline-light text-dark shadow-none d-flex justify-content-between align-items-center" :draggable="true" @dragstart="onDragStart($event, 'View One')" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample3" aria-expanded="false" aria-controls="collapseExample3">
              View One
            </button>
          </div>
          <div class="collapse ms-5 pe-2" id="collapseExample3">
            <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
              Column One
            </button>
            <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
              Column Two
            </button>
            <button class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2" type="button">
              Column Three
            </button>
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
            <button type="button" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row  w-100 mb-2">Data Model 1</button>
            <button type="button" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2">Data Model 2</button>
            <button type="button" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2">Data Model 3</button>
            <button type="button" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex flex-row w-100 mb-2">Data Model 4</button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>