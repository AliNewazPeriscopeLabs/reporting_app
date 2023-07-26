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
    <template v-if="columns[data.table_name]?.length">
      <div v-for="(col, i) in columns[data.table_name]" :key="i" class="form-check">
          <input v-model="selectedColumns" class="form-check-input" type="checkbox" :value="`${data.table_name}.${col.column_name}`" :id="`${data.table_name}_${col.column_name}_${i}`">
          <label class="form-check-label" :for="`${data.table_name}_${col.column_name}_${i}`">
              {{ col.column_name }}
          </label>
      </div>      
    </template>
    <!-- <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="columnTwo" checked>
        <label class="form-check-label" for="columnTwo">
            Column Two
        </label>
    </div> -->
  </div>

  <Handle id="a" type="source" :position="Position.Right"  />

</template>
<script>
export default {
  props:[
    'data',
    'columns',
    'preSelectedColumns',
    'setSelectedColumns'
  ],
  data() {
    return {
      selectedColumns:[]
    }
  },
  mounted() {
    if (this.preSelectedColumns.length>0) {
      this.selectedColumns = this.preSelectedColumns.filter(e=>{
        const table = e.split('.').shift();
        return table === this.data.table_name
      })
    }
  },
  watch:{
    selectedColumns(x){
      if (x.length>0) {
        this.setSelectedColumns(x)
      }
    }
  }
}
</script>
<style >
  .card{
    font-size: 12px;
  }
</style>
