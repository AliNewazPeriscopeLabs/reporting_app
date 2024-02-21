<template>
  <div id="body">
    <router-view
      :data_loaded="spin"
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
      :setEmpty="setEmpty"
      :group_by="group_by"
      :addGroupBy="addGroupBy"
      :removeGroupBy="removeGroupBy"
      :sort_by="sort_by"
      :addSortBy="addSortBy"
      :removeSortBy="removeSortBy"
      :saveReportData="saveReportData"
      :setFilters="setFilters"
      :setGroupBy="setGroupBy"
      :setSortBy="setSortBy"
      :setSpin="setSpin"
      :setLimit="setLimit"
      :setOffset="setOffset"
      :limit="limit"
      :offset="offset"
      :setReportInfo="setReportInfo"
      :reportModelInfo="reportModelInfo" 
      :selectedModel="selectedModel"
      :setSelectedModel="setSelectedModel"
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
      spin: false,
      found: false,
      agreement_id: null,
      primary_property_id: null,
      formLoader: false,
      columns: [],
      data_list: [],
      selectedColumns: [],
      query_error: '',
      query:'',
      limit:200,
      offset:0,
      mappedTable: [],
      savedTableColumns: {},
      savedJoins: [],
      filters: [],
      sort_by: [],
      group_by: [],
      reportModelInfo:{},
      selectedModel: null 
    }
  },
  methods:{
    setSpin(flag){
      this.spin = flag;
    },
    setLimit(l){
      this.limit = l;
    },
    setOffset(o){
      this.offset = o;
    },
    addSortBy() {
      this.sort_by.push({ column: {}, value: 'order by', order: 'asc'  });
    },
    removeSortBy(index) {
      this.sort_by.splice(index, 1);
    },
    addGroupBy() {
      this.group_by.push({ column: {}, value: 'group by'  });
    },
    removeGroupBy(index) {
      this.group_by.splice(index, 1);
    },
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
    setEmpty(){
      this.filters = [];
      this.savedJoins = [];
      this.group_by = [];
      this.sort_by = [];
      this.selectedColumns = [];
      this.savedTableColumns = {};
      this.reportModelInfo = {};
      this.selectedModel = null
    },

    setSelectedColumns(columns, type = 'add', table = null) {
      if (type === 'remove') {
        this.selectedColumns = this.selectedColumns.filter(e => {
          const table_ = e.column_name.split('.').shift();
          return table_ != table;
        });
        return
      }
      this.selectedColumns = this.selectedColumns.filter(e => {
        const table_ = e.column_name.split('.').shift();
        return !columns.some(column => table_ === column.column_name.split('.').shift());
      });
 
      this.selectedColumns = [...this.selectedColumns, ...columns];
    },
    setData({columns=[], data=[], query='', error_message=''} ){
      this.columns = [...columns]
      this.data_list = [...data]
      this.query = query
      this.query_error = error_message
    },
    setFilters(filters=[]){
      this.filters = [...filters];
    },
    setMappedTable(table=[]){
      this.mappedTable = [...table]
    },
    setGroupBy(table=[]){
      this.group_by = [...table]
    },
    setSortBy(table=[]){
      this.sort_by = [...table]
    },
    setSavedColumns(columns={}){
      this.savedTableColumns = {...columns}
    },
    async saveReportData(id, report_name, report_desc, query, model, model_id = null) {
      // console.log(model_id)
      const { data:{ mId, success, message } } = await axios.post('/save-report',{
        connection_id: id,
        name: report_name,
        description: report_desc,
        data_query: query,
        data_model: model,
        model_id : model_id
      });
      if (success) {
        return {mId, success, message};
      } else {
        return {mId, success, message};
      }
    },
    setReportInfo(info){
      this.reportModelInfo = info;
    },
    setSelectedModel(model_id){
      this.selectedModel = model_id
    }
  }
}
</script>

<style>
</style>
