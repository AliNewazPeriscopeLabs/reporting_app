<template>
  <div id="body">
    <router-view
      :getConnectionList="getConnectionList"
      :connections="connections"
      :columns="columns"
      :data_list="data_list"
      :setData="setData"
      :query_error="query_error"
      :query="query"
      :setMappedTable="setMappedTable"
      :mappedTable="mappedTable"
      :setSavedColumns="setSavedColumns"
      :savedColumns="savedTableColumns"
      :selectedColumns="selectedColumns"
      :setSelectedColumns="setSelectedColumns"
      :savedJoins="savedJoins"
      :setSavedJoins="setSavedJoins"
      :filters="filters"
      :addFilter="addFilter"
      :removeFilter="removeFilter"
      :setFilters="setFilters"
    ></router-view>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import axios from 'axios';

export default {
  setup(){
    let connections = ref([]);
    onMounted( ()=>{
      getConnectionList()
    })
    async function getConnectionList(){
      const { data:{ data } } = await axios.get('/get-connection-list');
      connections.value = data;
    }
    return{
      connections,
      getConnectionList
    }
  },
  name: 'App',
  data() {
    return {
      found: false,
      agreement_id: null,
      primary_property_id: null,
      formLoader: false,
      columns: [],
      data_list: [],
      selectedColumns: [],
      query_error: '',
      query:'',
      mappedTable: [],
      savedTableColumns: {},
      savedJoins: [],
      filters: [],
    }
  },
  methods:{
    addFilter() {
      if (this.filters.length === 0) {
        this.filters.push({ flag: false, column: '', operator_type: null, filter_value: {}  });
      } else {
        this.filters.push({ flag: true, and_or:'and', column: '', operator_type: null, filter_value: {} });
      }
    },
    removeFilter(index) {
      this.filters.splice(index, 1);
    },
    setSavedJoins(join){
      this.savedJoins= join
    },
    setFilters(filters=[]){
      this.filters = filters
    },
    setSelectedColumns(columns){
      this.selectedColumns = [...new Set([...this.selectedColumns, ...columns])];
    },
    setData({columns=[], data=[], query='', error_message=''} ){
      this.columns = [...columns]
      this.data_list = [...data]
      this.query = query
      this.query_error = error_message
    },
    setMappedTable(table=[]){
      this.mappedTable = [...table]
    },
    setSavedColumns(columns={}){
      this.savedTableColumns = {...columns}
    }
  }
}
</script>

<style>
</style>
