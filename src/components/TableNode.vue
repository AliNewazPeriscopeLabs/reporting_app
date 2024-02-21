<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<template>

  <div
    style="display: flex; flex-direction: column; flex-wrap: wrap; justify-content: center; margin: auto; gap: 3px;"
    class="card border border-secondary"
  >
    <div class="card-header d-flex bg-secondary text-white justify-content-between">
      <h6 class="text-truncate d-flex"> {{data.table_name}} </h6>
      <div class="d-flex">
    
        <button
          class="btn d-flex btn-link text-white text-center ml-auto align-content-center"
          type="button"
          data-toggle="collapse"
          @click="expand = !expand"
        >
          <span :class="{ 'caret-up': expand, 'caret-down': !expand }"></span>
        </button>
        <!-- <span>
          <i class="fa fa-times "></i>
        </span>  -->
      </div>

        
    </div>
     
    <div class="card-body container" style="max-height: 200px; overflow:auto; width: 200px;">
      <div class="form-check">
        <input
          v-model="selectAll"
          class="form-check-input"
          type="checkbox"
          @change="handleSelectAll"
          id="selectAll"
          :indeterminate="isIndeterminate"
        />
        <label class="form-check-label" for="selectAll">
        All (*)
        </label>
      </div>
              
      <template v-if="columns[data.table_name]?.length && expand">
        <div v-for="(col, i) in columns[data.table_name]" :key="i" class="form-check text-truncate">
            <input v-model="checkedColumns" class="form-check-input" type="checkbox" :value="`${data.table_name}.${col.column_name}`" :id="`${data.table_name}_${col.column_name}_${i}`">
            <label class="form-check-label text-truncate" :for="`${data.table_name}_${col.column_name}_${i}`">
              <span class="text-truncate">{{ col.column_name }}  <cite class="font-weight-light text-secondary" style="font-size:10px;">{{col.data_type}}</cite> </span>  
            </label>
        </div>      
      </template>
    </div>
  </div>

  <Handle id="a" type="source" :position="Position.Left" />
  <Handle id="b" type="source" :position="Position.Right" />

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
      checkedColumns:[],
      selectedColumns:[],
      expand: true,
      selectAll: false
    }
  },
  mounted() {
    if (this.preSelectedColumns.length>0) {
      const preCols = this.preSelectedColumns.filter(e=>{
        const table = e.column_name.split('.').shift();
        // console.log(table, this.data.table_name, 'got table');
        return table === this.data.table_name
      })

      this.checkedColumns = preCols.map(column => column.column_name);
      this.selectedColumns = preCols;
      this.selectAll = preCols.length === this.columns[this.data.table_name].length;
    }
  },
  watch:{
    selectedColumns(x){
      if (x.length>0) {
        this.setSelectedColumns(x)
      } else {
        this.setSelectedColumns(null, 'remove', this.data.table_name)
      }
    },
    checkedColumns(x){
      if (x.length > 0) {
        console.log(this.checkedColumns)
        this.selectedColumns = x.map(column => {
          const [table, columnName] = column.split('.');
          const predefinedColumn = this.preSelectedColumns.length > 0 ? this.preSelectedColumns.find(col => col.column_name === column) : null;
          return {
            column_name: column,
            alias: predefinedColumn ? predefinedColumn.alias : `${table}_${columnName}`
          };
        });
      } else {
        this.selectedColumns = this.selectedColumns.filter(e => {
          const table_ = e.column_name.split('.').shift();
          return table_ != this.data.table_name;
        });
      }
    }    
  },
  methods: {
    handleSelectAll() {
      if (this.selectAll) {
        this.checkedColumns = this.columns[this.data.table_name]?.map(col => `${this.data.table_name}.${col.column_name}`) || [];
      } else {
        this.checkedColumns = [];
      }
    }
  },
   computed: {
    isIndeterminate() {
      return this.checkedColumns.length > 0 && this.checkedColumns.length < this.columns[this.data.table_name]?.length;
    }
  },
}
</script>
<style >
  .card{
    font-size: 12px;
  }
  .vue-flow__handle {
    width: 15px !important;
    height: 15px !important;
  }
  .caret-up {
    border-bottom: 0.3em solid;
    border-left: 0.3em solid transparent;
    border-right: 0.3em solid transparent;
    width: 10px;
  }

  .caret-down {
    border-top: 0.3em solid;
    border-left: 0.3em solid transparent;
    border-right: 0.3em solid transparent;
    width: 10px;
  }
  .caret-up:hover, .caret-down:hover{
    color: aqua;
  }
</style>
