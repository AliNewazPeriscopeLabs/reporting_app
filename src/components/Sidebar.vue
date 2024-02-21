<template>
  <aside>
    <div class="description text-secondary fs-6">
      <i class="fa-solid fa-database me-2"></i>{{ db_name() }}
    </div>

    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item mb-2">
        <h2 class="accordion-header" id="flush-headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            <i class="fa-solid fa-folder-tree me-2"></i>Tables
          </button>
        </h2>
        <div id="flush-collapseOne" class="accordion-collapse collapse py-2" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
          <template v-for="(tab, i) in tables_list" :key="i">
            <div  class="nodes p-2 ms-4">
              <button @click="!columns[tab.tablename] ? getColumns(tab.tablename) : ''" class="vue-flow__node-input btn-style btn btn-outline-light text-dark shadow-none d-flex justify-content-between align-items-center" :draggable="true" @dragstart="onDragStart($event,'custom', tab.tablename)" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${i}`" aria-expanded="false" :aria-controls="`collapseExample${i}`">
                <i class="fa-solid fa-table me-2"></i><span class="text-truncate">{{tab.tablename}}</span> 
              </button>
            </div>
            <div class="collapse ms-5 pe-2" :id="`collapseExample${i}`">
              <template v-if="columns[tab.tablename]?.length">
                <button v-for="(item, i) in columns[tab.tablename]" :key="i" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex justify-content-start align-items-center w-100 mb-2" type="button">
                  <i class="fa-solid fa-diamond me-2"></i> <span class=" text-truncate"> {{item.column_name}} <cite class="font-weight-light text-secondary" style="font-size:13px;">{{item.data_type}}</cite></span>
                </button>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div v-if="views_list.length>0" class="accordion-item mb-2">
        <h2 class="accordion-header" id="flush-headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
            <i class="fa-solid fa-folder-tree me-2"></i>Views
          </button>
        </h2>
        <div id="flush-collapseTwo" class="accordion-collapse collapse py-2" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
          <template v-for="(tab, i) in views_list" :key="i">
            <div  class="nodes p-2 ms-4">
              <button @click="!columns[tab.tablename] ? getColumns(tab.tablename) : ''" class="vue-flow__node-input btn-style btn btn-outline-light text-dark shadow-none d-flex justify-content-between align-items-center" :draggable="true" @dragstart="onDragStart($event,'custom', tab.tablename)" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${i}`" aria-expanded="false" :aria-controls="`collapseExample${i}`">
                <i class="fa-solid fa-table me-2"></i><span class=" text-truncate">{{tab.tablename}} </span>
              </button>
            </div>
            <div class="collapse ms-5 pe-2" :id="`collapseExample${i}`">
              <template v-if="columns[tab.tablename]?.length">
                <button v-for="(item, i) in columns[tab.tablename]" :key="i" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex justify-content-start align-items-center w-100 mb-2" type="button">
                  <i class="fa-solid fa-diamond me-2"></i><span class=" text-truncate">{{item.column_name}}</span>
                </button>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div v-if="models_list.length>0" class="accordion-item">
        <h2 class="accordion-header" id="flush-headingThree">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
            <i class="fa-solid fa-network-wired me-2"></i>Data Models
          </button>
        </h2>
        <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
          <div class="d-flex flex-column justify-content-center  p-4">
            <template v-for="(tab, i) in models_list" :key="i">
              <button :disabled="tab.id == selectedModel" :draggable="false" @dragstart="onDragStart($event,'model', tab.id)" type="button" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none d-flex justify-content-start align-items-center w-100 mb-2" data-bs-toggle="collapse" :data-bs-target="`#collapseExample${i}`" aria-expanded="false" :aria-controls="`collapseExample${i}`">
                <i class="fa-brands fa-hive me-2"></i><span class=" text-truncate">{{tab.name}}</span>
              </button>
              <div v-if="tab.id != selectedModel" class="collapse ms-5 pe-2" :id="`collapseExample${i}`">
                <div class="row">
                  <button @click="editModel(tab.id)" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none mb-2 col-4" type="button" data-toggle="tooltip" data-placement="bottom" title="Edit Model">
                    <i class="fa-solid fa-pencil me-2 text-secondary"></i> 
                  </button> 
                  <button @click="previewModel(tab.id)" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none  mb-2 col-4" type="button" data-toggle="tooltip" data-placement="bottom" title="Preview Model">
                    <i class="fa-solid fa-eye me-2 text-info"></i> 
                  </button>
                  <button @click="deleteModel(tab.id)" class="btn-style btn btn-outline-light text-dark fw-normal shadow-none mb-2 col-4" type="button" data-toggle="tooltip" data-placement="bottom" title="Remove Model">
                    <i class="fa-solid fa-trash me-2 text-danger"></i> 
                  </button>
                </div>
               
              </div>
            </template>
          </div>
        </div>
      </div> 
    </div>

    <div class="d-flex align-items-center" style="position: absolute; bottom: 10px; z-index: 10;">
      <button @click="$router.push({ name: 'home'}), setMappedTable(), setSavedColumns(), setEmpty()" type="button" class="btn btn-secondary d-flex justify-content-center align-items-center fa-rotate-180" title="Drop Connection">
        <svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 512 512"><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" fill="#fff"/></svg>
      </button>
      <!-- <div class="text-muted ms-4">
        <i class="fa-regular fa-copyright me-1"></i>Periscope Labs Limited 2023
      </div> -->
    </div>
    <ConfirmAlert
      v-if="deleteCon"
      :confirmCheck="deleteCheck"
      :cancelCheck="cancelCheck"
      :alertMsg="'Are you sure you want to remove this Report Model?'"
    ></ConfirmAlert>
    <ConfirmAlert
      v-if="editMod || previewMod"
      :confirmCheck="completeCheck"
      :cancelCheck="cancelCheck"
      :alertMsg="'You have unsaved changes. Are you sure you want to continue?'"
    ></ConfirmAlert>
    <spinner v-if="loader"></spinner>
  </aside>

</template>
<script>
import spinner from './loader/spinner.vue';
import axios from 'axios';
import ConfirmAlert from './modal/ConfirmAlert.vue'
import toastr from '@/utils/toaster';
export default {
  setup(){
    function onDragStart(event, nodeType, value) {
      if (event.dataTransfer) {
        if (nodeType === 'model') {
          // console.log(value);
          event.dataTransfer.setData('application/model', value)
          return
        }
        event.dataTransfer.setData('application/vueflow', nodeType)
        event.dataTransfer.setData('application/table', value)
        event.dataTransfer.effectAllowed = 'move'
      }
    }
    return {
      onDragStart
    }
  },
  components:{
    ConfirmAlert,
    spinner
  },
  props:[
    'tables_list',
    'views_list',
    'models_list',
    'columns',
    'getColumns',
    'savedColumns',
    'setSavedColumns',
    'setMappedTable',
    'db_name',
    'setEmpty',
    'getModelsList',
    'selectedModel',
    'loadModel',
    'runReportData',
    'tables'
  ],
  data() {
    return {
      loader: false,
      deleteCon: false,
      editMod: false,
      previewMod: false,
      mod_id: null
    }
  },
  methods: {
    deleteModel(id){
      this.deleteCon = true;
      this.mod_id = id
    },
    async editModel(model_id){
      if (this.tables.length > 0) {
        this.editMod = true;
        this.mod_id = model_id
      } else {
        await this.loadModel(model_id)
      }
    },
    async previewModel(model_id){
      if (this.tables.length > 0) {
        this.previewMod = true;
        this.mod_id = model_id
      } else {
        await this.loadModel(model_id);
        await this.runReportData()
      }
    },
    async completeCheck(flag){
      if (flag) {
        await this.loadModel(this.mod_id)
        if (this.previewMod) {
          await this.runReportData()
        }        
        this.cancelCheck()
      }
    },

    async deleteCheck(flag){
      this.loader = true
      if (flag) {
        const { data:{ success, message } } = await axios.get(`/remove-report?model_id=${this.mod_id}`);
        if (success) {
          this.cancelCheck()
          this.getModelsList()
          toastr.success(message);
        } else {
          toastr.error(message);
        }
      }
      this.loader = false
    },
  
    cancelCheck(){
      this.deleteCon = false;
      this.editMod = false;
      this.previewMod = false;
    }
  },
}
</script>