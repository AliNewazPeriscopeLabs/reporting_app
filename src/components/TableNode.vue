<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<template>

  <div
    style="display: flex; flex-direction: column; flex-wrap: wrap; justify-content: center; margin: auto; gap: 3px;"
    class="card p-2"
  >
    <h6>{{data.table_name}}</h6>
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
            All
        </label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="columnOne">
        <label class="form-check-label" for="columnOne">
            Column One
        </label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="columnTwo" checked>
        <label class="form-check-label" for="columnTwo">
            Column Two
        </label>
    </div>
  </div>

  <Handle id="a" type="source" :position="Position.Right"  />

</template>
<script>
export default {
  props:[
    'data'
  ]
}
</script>
<style >
  .card{
    font-size: 12px;
  }
</style>
