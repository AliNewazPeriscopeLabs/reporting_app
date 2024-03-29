<template>
<div style="height:100vh">
  <!-- <Navbar 
    :showSideBar="showSideBar" 
    :showOptionsPane="showOptionsPane" 
    @toggleSidebar="showSideBar = !showSideBar"
    @toggleOptionsPane="showOptionsPane = !showOptionsPane"
  /> -->
  <div class="dndflow" @drop="onDrop">
    <Sidebar 
      v-if="showSideBar"
      :tables_list="tables_list"
      :views_list="views_list"
      :models_list="models_list"
      :getColumns="getColumns" 
      :columns="columns"
      :setMappedTable="setMappedTable"
      :setSavedColumns="setSavedColumns"
      :db_name="db_name"
      :setEmpty="setEmpty"
      :getModelsList="getModelsList"
      :selectedModel="selectedModel"
      :loadModel="loadModel"
      :runReportData="runReportData"
      :tables="tables"
    />
    <div class="d-flex flex-column justify-content-center align-items-center w-100" style="height: 100vh;">
      <VueFlow 
        v-model="tables" 
        @dragover="onDragOver"
        :connection-radius="80"
      >
        <template #node-custom="{ data }">
          <TableNode 
            ref="node"
            :data="data"
            :columns="columns"  
            :preSelectedColumns="selectedColumns"  
            :setSelectedColumns="setSelectedColumns"
          />
        </template>
        <Panel :position="PanelPosition.TopRight" class="controls">
          <div class="d-flex justify-content-center align-items-center">
            <button v-show="tables.length > 0" @click="runReportData" class="btn btn-outline-primary btn-sm me-2">
              Preview
            </button>
            <button style="background-color: #113285; color: white" title="Reset Transform" @click="resetTransform(), setEmpty(), joins=[], columns={}">
                <svg width="16" height="16" viewBox="0 0 32 32">
                    <path fill="#FFFFFB" d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z" />
                </svg>
            </button>
            <!-- <button v-if="selectedNode" class="btn btn-outline-danger btn-sm mx-2" title="Remove Selected Node" @click="removeNode()">
              <i class="fa fa-trash"></i>
            </button> -->
          </div>
        </Panel>
        <Background/>  
      </VueFlow>
      <OptionsPen 
        v-if="showOptionsPane"
        :updateJoinType="updateJoinType"
        :tables="tables"
        :filters="filters"
        :joins="joins"
        :group_by="group_by"
        :sort_by="sort_by"
        :addFilter="addFilter"
        :removeFilter="removeFilter"
        :removeJoins="removeJoins"
        :addGroupBy="addGroupBy"
        :removeGroupBy="removeGroupBy"
        :addSortBy="addSortBy"
        :removeSortBy="removeSortBy"
        :setLimit="setLimit"
        :columns="columns"
        :setOffset="setOffset"
        :offset="offset"
        :limit="limit"
        :selectedColumns="selectedColumns"
        :mappedTables="mappedTables"
      />
    </div>
    <spinner v-if="spin"></spinner>
    <join-modal 
      v-if="joinModal"
      :close="removeJoin"
      :create="addJoinType"
      :s_table="s_table"
      :t_table="t_table"
      :columns="columns"
      :createJoin="createJoin"
    ></join-modal>
  </div>

</div>
</template>
<script>
import { Background } from '@vue-flow/background'
import { Panel, PanelPosition, VueFlow, useVueFlow } from '@vue-flow/core'
import { nextTick, watch } from 'vue'
import Sidebar from './Sidebar.vue'
// import Navbar from './Navbar.vue'
import OptionsPen from './OptionsPen.vue'
import TableNode from './TableNode.vue'
import JoinModal from './modal/JoinModal.vue'
import spinner from './loader/spinner.vue'
import axios from 'axios'
import { ref } from 'vue'
import toastr from '@/utils/toaster';
export default {
  setup() {
    let tables = ref([]);
    let joinModal = ref(false);
    let id = 0;
    let selectedNode = ref('');
    // let s_table = '', t_table = '';
    function getId(table) {
      return `${table}_${id++}`;
    }

    const { findNode, onConnect, addEdges, addNodes, project, vueFlowRef, $reset, removeNodes, onNodeClick } = useVueFlow({
      nodes: [
        {
          id: '1',
          type: 'input',
          label: 'input node',
          position: { x: 250, y: 25 },
        },
      ],
    });

    function resetTransform() {
      tables = [];
      $reset();
      
    }
    function onDragOver(event) {
      event.preventDefault()

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
    onNodeClick((event) => {
      selectedNode.value = event.node.id;
    })

    return {
      tables,
      resetTransform,
      onDragOver,
      joinModal,
      PanelPosition,
      findNode,
      addNodes,
      project,
      vueFlowRef,
      onConnect,
      getId,
      addEdges,
      removeNodes,
      selectedNode
    }
  },
  data() {
    return {
      tables_list:[],
      views_list:[],
      models_list:[],
      orphan_tables:[],
      spin: false,
      columns:{},
      joins: [],
      s_table: '',
      t_table: '',
      showSideBar: true,
      showOptionsPane: true,
    }
  },
  components:{
    Background,
    VueFlow,
    Panel,
    OptionsPen,
    TableNode,
    spinner,
    JoinModal,
    Sidebar,
    // Navbar
  },
  props:[
    'connections',
    'setData',
    'mappedTable',
    'setSavedColumns',
    'savedColumns',
    'selectedColumns',
    'setSelectedColumns',
    'savedJoins',
    'setSavedJoins',
    'filters',
    'setFilters',
    'addGroupBy',
    'removeGroupBy',
    'addFilter',
    'removeFilter',
    'setEmpty',
    'group_by',
    'sort_by',
    'addSortBy',
    'setSpin',
    'removeSortBy',
    'setGroupBy',
    'setSortBy',
    'setLimit',
    'limit',
    'setMappedTable',
    'setReportInfo',
    'setOffset',
    'offset',
    'selectedModel',
    'setSelectedModel'
  ],
  async created() {
    this.spin=true;
    await Promise.all([this.getTablesList(), this.getViewsList(), this.getModelsList()])
    this.spin=false;
    
    this.getTablesList()
    
    this.onConnect((params) =>{
      const joinId = this.getRandomInt(1000, 2999);
      this.joinModal = true;
      
      const s_table_parts = params.source.split('_');
      s_table_parts.pop();
      this.s_table = s_table_parts.join('_');
      const t_table_parts = params.target.split('_')
      t_table_parts.pop()
      this.t_table = t_table_parts.join('_');
      // this.addJoinId(joinId);
      // this.getConnectedTables(s_table, t_table)
      this.addEdges({
        ...params,
        label: 'Inner-Join',
        style: { stroke: 'blue' },
        labelBgStyle: { fill: '#6d6d6d' },
        labelStyle: { fill: 'white', fontSize: '12px', fontWeight: 'bold' },
        join_id: joinId,
        animated: true,
        labelBgPadding: [10,10]
        // type: 'step',
      })
    })
  },
  mounted() {
    if (this.mappedTable.length>0) {
      this.tables = [...this.mappedTable]
    }
    if (this.savedJoins.length>0) {
      this.joins = [...this.savedJoins]
    }
    if (this.savedColumns) {
      this.columns = {...this.savedColumns}
    }
  },
  watch:{
    tables(x){
      if (!this.joins.length) {
        this.orphan_tables = x.map(e => e.data.table_name)
      }
    },
  },
  computed:{
    id(){
      if (this.$route && this.$route.query) {
        return this.$route.query.id
      } 
      return null;
    }
  },
  methods: {
    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    createJoin(x){
      // console.log(x);
      const joinData = JSON.parse(JSON.stringify(x))
      joinData.join_id = this.tables[this.tables.length-1].join_id;
      this.tables[this.tables.length-1].label = joinData.join_type;
      this.joins.push(joinData);
      this.joinModal = false;
    },
    getConnectedTables(s_table, t_table){
      this.s_table = s_table;
      this.t_table = t_table
    },
    async onDrop(event) {
      const type = event.dataTransfer?.getData('application/vueflow')
      const tableName = event.dataTransfer?.getData('application/table')
      const model_id = event.dataTransfer?.getData('application/model')
      if (model_id) {
        await this.loadModel(model_id)
        return
      }
      const { left, top } = this.vueFlowRef.getBoundingClientRect()

      const position = this.project({
        x: event.clientX - left,
        y: event.clientY - top,
      })
      if (!this.columns[tableName]?.length) {
        await this.getColumns(tableName)
      }
      const newNode = {
        id: this.getId(tableName),
        type: 'custom',
        data:{
          table_name: tableName
        },
        position,
        label: `${tableName} ${type}`,
      }

      this.addNodes([newNode])

      // align node position after drop, so it's centered to the mouse
      nextTick(() => {
        const node = this.findNode(newNode.id)
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
        // console.log(node);
      })
    },
    async loadModel(model_id){
      const model = this.models_list.find(e=>e.id == model_id);
        // console.log(model);
      const joins = JSON.parse(model.data_model).joins;
      // this.joins
      let col= [];
      for (const join of joins) {
        this.columns[join.from_table] === undefined ? col.push(this.getColumns(join.from_table)) : '';
        this.columns[join.to_table] === undefined ? col.push(this.getColumns(join.to_table)) : '';
      }
      await Promise.all(col);
      this.joins = [...joins];
      JSON.parse(model.data_model).columns.length ? this.setSelectedColumns(JSON.parse(model.data_model).columns) : '';
      this.setSelectedModel(model_id);
      this.setGroupBy(JSON.parse(model.data_model).group_by);
      this.setSortBy(JSON.parse(model.data_model).sort_by);
      this.setFilters(JSON.parse(model.data_model).filters);
      this.setReportInfo({report_id : model_id, report_name: model.name, report_desc: model.description});
      this.tables = JSON.parse(model.data_model).tables;
    },
    removeJoin(){
      this.joinModal = false;
      this.tables.pop();
    },
    removeJoins(join_id, index) {
      this.joins.splice(index, 1);
      this.tables = this.tables.filter(e => e.join_id != join_id);
    },
    addJoinType(type){
      this.tables[this.tables.length-1].label = type
      this.joinModal = false;
    },
    updateJoinType(id, type){
      const join = this.tables.find(e=>e.join_id==id);
      join.label = type;
    },
    // addJoinId(id){
    //   this.joins[this.joins.length-1].join_id = id;
    // },
    db_name(){
      const default_db = this.connections.find(e=>e.id == this.id)?.default_db
      return default_db
    },
    async getTablesList(){
      const { data:{ data } } = await axios.get('/get-tables?connection_id='+this.id);
      this.tables_list = data;
    },
    async getViewsList(){
      const { data:{ data } } = await axios.get('/get-views?connection_id='+this.id);
      this.views_list = data;
    },
    async getModelsList(){
      const { data:{ data } } = await axios.get('/get-reports?connection_id='+this.id);
      this.models_list = data;
    },
    async getColumns(table){
      this.spin=true;
      const {data:{data}} = await axios.get(`get-columns?connection_id=${this.id}&table_name=${table}`)
      // console.log(data);
      this.columns[table] = data
      this.spin=false;
    },
    async runReportData(){

      console.log(this.filters)

      if(!this.validateArray(this.sort_by)) {
        return toastr.error('Please fill up all the fields!'); 
      } else if (!this.validateArray(this.group_by)) {
        return toastr.error('Please fill up all the fields!'); 
      } else if (!this.validateArray(this.filters)){
       return toastr.error('Please fill up all the fields!'); 
      } else if (this.selectedColumns.length === 0) {
        return toastr.error('Please select Columns!'); 
      } else {
        // this.$router.push({ name: 'preview', query:{ id: this.id }  })
      }
      
      
      // this.setSpin(true); 
      //   this.setSavedJoins(this.joins);
      //   this.setMappedTable(this.tables);
      //   this.setSavedColumns(this.columns);
      //   const connection = this.connections.find(e=>e.id == this.id);
      //   const {data:{data, query,success, error_message}} = await axios.post('/get-report-data',{
      //     joins: this.joins,
      //     sort_by: this.sort_by,
      //     group_by: this.group_by,
      //     table: this.joins.length >0 ? [] : this.orphan_tables,
      //     selecedCols: this.selectedColumns,
      //     filters: this.filters,
      //     limit: this.limit,
      //     offset: this.offset,
      //     connection
      //   });
      //   const columns = data.length>0 ? Object.keys(data[0]) : ['No Data Found'];
      //   if (success) {
      //     this.setData({columns, data, query});
      //   } else {
      //     this.setData({query, error_message});
      //   }
      //   this.setSpin(false);
    },
    validateArray(inputArray) {
      if (!Array.isArray(inputArray)) {
        return false;
      }

      for (let i = 0; i < inputArray.length; i++) {
          const obj = inputArray[i];
          if (Object.values(obj).some(value => {
              if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                  if (Object.keys(value).length === 0 && Object.keys(value).some(key => key !== 'filter_value')) {
                      return true; // Check if it's an empty object
                  }
                  return false
              }
              return value === null || value === '';
          })) {
              return false;
          }
      }
      return true;
    },
    removeNode(){
      this.removeNodes(this.selectedNode)
      this.selectedNode = '';
    },
    setJoins(joins){
      this.joins = [...joins];
    },
    setTables(tables){
      this.tables = tables;
    }
  },
}
</script>
<style scoped>
    
</style>