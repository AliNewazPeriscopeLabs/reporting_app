<template>
  <div class="dndflow" @drop="onDrop">
    <Sidebar 
      :tables_list="tables_list"
      :getColumns="getColumns" 
      :columns="columns"
      :setMappedTable="setMappedTable"
      :setSavedColumns="setSavedColumns"
      :db_name="db_name"
      :setFilters="setFilters"
    />
    <div class="d-flex flex-column justify-content-center align-items-center w-100" style="height: 100vh;">
      <VueFlow 
        v-model="tables" 
        @dragover="onDragOver"
      >
        <template #node-custom="{ data }">
          <TableNode 
            ref="node"
            :data="data"
            :columns="columns"  
            :setSelectedColumns="setSelectedColumns"
          />
        </template>
        <Panel :position="PanelPosition.TopRight" class="controls">
          <div class="d-flex justify-content-center align-items-center">
            <router-link @click="runReportData" :to="{ name: 'preview', query:{ id: id } }" class="btn btn-outline-primary btn-sm me-2">
              Preview
            </router-link>
            <button style="background-color: #113285; color: white" title="Reset Transform" @click="resetTransform">
                <svg width="16" height="16" viewBox="0 0 32 32">
                    <path fill="#FFFFFB" d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z" />
                </svg>
            </button>
          </div>
        </Panel>
        <Background/>  
      </VueFlow>
      <OptionsPen 
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
        :columns="columns"
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
</template>
<script>
import { Background } from '@vue-flow/background'
import { Panel, PanelPosition, VueFlow, useVueFlow } from '@vue-flow/core'
import { nextTick, watch } from 'vue'
import Sidebar from './Sidebar.vue'
import OptionsPen from './OptionsPen.vue'
import TableNode from './TableNode.vue'
import JoinModal from './modal/JoinModal.vue'
import spinner from './loader/spinner.vue'
import axios from 'axios'
import { ref } from 'vue'
export default {
  setup() {
    let tables = ref([]);
    let joinModal = ref(false);
    let id = 0;
    // let s_table = '', t_table = '';
    function getId(table) {
      return `${table}_${id++}`;
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
      addEdges
    }
  },
  data() {
    return {
      tables_list:[],
      orphan_tables:[],
      spin: false,
      columns:{},
      joins: [],
      s_table: '',
      t_table: '',
      group_by: [],
      sort_by: [],
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
    Sidebar
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
    'addFilter',
    'removeFilter',
    'setFilters',
    'setMappedTable'
  ],
  created() {
    this.getTablesList()
    
    this.onConnect((params) =>{
      const joinId = this.getRandomInt(1000, 1999);
      this.joinModal = true;
      
      const s_table_parts = params.source.split('_')
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
        style: { stroke: 'orange' },
        labelBgStyle: { fill: 'orange' },
        join_id: joinId,
        type: 'custom',
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
      const joinData = JSON.parse(JSON.stringify(x))
      joinData.join_id = this.tables[this.tables.length-1].join_id;
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
    // addJoinId(id){
    //   this.joins[this.joins.length-1].join_id = id;
    // },
    addGroupBy() {
      this.group_by.push({ column: {}, value: 'group by'  });
    },
    removeGroupBy(index) {
      this.group_by.splice(index, 1);
    },
    addSortBy() {
      this.sort_by.push({ column: {}, value: 'order by', order: 'asc'  });
    },
    removeSortBy(index) {
      this.sort_by.splice(index, 1);
    },
    db_name(){
      const default_db = this.connections.find(e=>e.id == this.id)?.default_db
      return default_db
    },
    async getTablesList(){
      this.spin=true;
      const { data:{ data } } = await axios.get('/get-tables?connection_id='+this.id);
      this.tables_list = data;
      this.spin=false;
      
    },
    async getColumns(table){
      this.spin=true;
      const {data:{data}} = await axios.get(`get-columns?connection_id=${this.id}&table_name=${table}`)
      // console.log(data);
      this.columns[table] = data
      this.spin=false;
    },
    async runReportData(){
      this.setSavedJoins(this.joins);
      this.setMappedTable(this.tables);
      this.setSavedColumns(this.columns);
      const connection = this.connections.find(e=>e.id == this.id);
      const {data:{data, query,success, error_message}} = await axios.post('/get-report-data',{
        joins: this.joins,
        table: this.joins.length >0 ? [] : this.orphan_tables,
        selecedCols: this.selectedColumns,
        filters: this.filters,
        connection
      });
      const columns = data.length>0 ? Object.keys(data[0]) : ['No Data Found'];
      if (success) {
        this.setData({columns, data, query});
      } else {
        this.setData({query, error_message});
      }
    }
  },
}
</script>
<style scoped>
    
</style>