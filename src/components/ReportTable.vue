<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mt-2">
      <router-link :to="{ name: 'table-map', query:{ id: id } }" class="text-decoration-none">
        <i class="fa-solid fa-arrow-left me-2"></i>Table Map
      </router-link>
      <div class="d-flex justify-content-center align-items-center">
        <button @click.prevent="saveReport()" type="button" class="btn btn-outline-primary btn-sm shadow-none me-2">
          <i class="fa-solid fa-floppy-disk me-2"></i>Save
        </button>
        <div class="dropdown">
          <button class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fa-solid fa-download me-2"></i>Export
          </button>
          <div class="dropdown-menu">
            <!-- <button class="dropdown-item fw-light" type="button">
              <i class="fa-solid fa-file-pdf me-2"></i>PDF
            </button> -->
            <button @click.prevent="exportXls" class="dropdown-item fw-light" type="button">
              <i class="fa-solid fa-file-excel me-2"></i>EXCEL
            </button>
            <!-- <button class="dropdown-item fw-light" type="button">
              <i class="fa-solid fa-file-csv me-2"></i>CSV
            </button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="mt-0">
      <div v-if="report_has_info" class="mt-3">
        <h5 class="fw-normal mb-3">
          <i class="fa-solid fa-file-invoice me-2"></i>Sales Report
        </h5>
        <p class=" fw-normal text-muted">
          <i class="fa-solid fa-clipboard me-2"></i>This report describe about monthly sales report.
        </p>
      </div>
      <div v-else>
        <div class="form-floating mb-0 w-50">
          <input type="text" class="form-control" id="floating1" placeholder="Enter Your Report Name" v-model="report_name">
          <label for="floating1">
            <i class="fa-solid fa-file-invoice me-2"></i>Enter Your Report Name
          </label>
          <div style="margin-left: 12px;">
            <span class="text-danger" v-if="errorList['report_name']">
              {{errorList['report_name']}}
            </span>
          </div>
        </div>
        <div class="form-floating w-50">
          <input type="text" class="form-control" id="floating2" placeholder="Enter Your Report Description" v-model="report_desc">
          <label for="floating2">
            <i class="fa-solid fa-clipboard me-2"></i>Enter Your Report Description
          </label>
          <div style="margin-left: 12px;">
            <span class="text-danger" v-if="errorList['report_desc']">
              {{errorList['report_desc']}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <hr :class="[report_has_info ? 'mt-4' : '']">
    <div>
      <div class="card mt-5 py-2">
        <pre class="pre-scrollable border-start border-primary border-5 rounded" data-spy="scroll" style="font-size: 0.85rem; height: 200px; margin-bottom: 0px;">
          {{ query }}
        </pre>
      </div>
      <div v-if="query_error" class="error-message">
        <h5>Error: MySQL Query</h5>
        <p>{{ query_error }}</p>
      </div>
    </div>
    <div v-if="!query_error" class="table-responsive mt-5" style="height: 80vh;">
      <table class="table table-striped border border-1">
        <thead>
          <tr>
            <th v-for="(item, i) in columns" :key="i"  scope="col">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, i) in data_list" :key="i">
            <td v-for="(col, j) in columns" :key="j" scope="row">{{ data[col] }}</td>
            <!-- <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <spinner v-if="spin"></spinner>
  <spinner v-if="query_error === '' && data_list.length === 0"></spinner>
</template>
  
<script>
import axios from 'axios';
import spinner from './loader/spinner.vue';
import toastr from '@/utils/toaster';
export default {
  props:[
    'columns',
    'query',
    'query_error',
    'data_list',
    'saveReportData',
    'savedJoins',
    'filters',
    'group_by',
    'sort_by',
    'mappedTable'
  ],
  components:{
    spinner
  },
  data() {
    return {
      report_has_info: false,
      spin: false,
      con_id: null,
      report_name: '',
      report_desc: '',
      errorList: {},
    }
  },
  created() {
    this.con_id = this.id ? this.id : null;
  },
  mounted() {
  },
  computed: {
    id(){
      if (this.$route && this.$route.query) {
        return this.$route.query.id
      } 
      return null;
    },
    requiredCheck() {
      if (this.con_id === null) {
        return true;
      }
      if (this.report_name === "") {
        return true;
      }
      if (this.report_desc === "") {
        return true;
      }
      if (this.query === "") {
        return true;
      }
      return false;
    }
  },
  watch: {
    report_name: function(x){
      if(x === '') {
        this.errorList['report_name'] = 'Report Name is required'
      } else {
        this.errorList['report_name'] = null
      }
    },
    report_desc: function(x){
      if(x === '') {
        this.errorList['report_desc'] = 'Report Description is required'
      } else {
        this.errorList['report_desc'] = null
      }
    },
  },
  methods: {
    async exportXls(){
      this.validationNameAndDesc();
      if (this.requiredCheck === false) {
        this.spin = true;
        let details = {
          'rep_name': this.report_name, 
          'rep_desc': this.report_desc
        }
        const {data:{data}} = await axios.post('/get-excel',{
          datalist: this.data_list,
          columns: this.columns,
          details: details
        })
        let a = document.createElement('A');
        a.href = process.env.VUE_APP_BACKEND_HOST+data;
        a.download = data.substr(data.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.spin = false;
        this.deleteFile(data);
      }
    },
    async exportPdf(){
      const {data:{data}} = await axios.post('/get-pdf',{
          datalist: this.data_list,
          columns: this.columns
        })
        let a = document.createElement('A');
        a.href = process.env.VUE_APP_BACKEND_HOST+data;
        a.download = data.substr(data.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
    async exportCsv(){
      const {data:{data}} = await axios.post('/get-csv',{
          datalist: this.data_list,
          columns: this.columns
        })
        let a = document.createElement('A');
        a.href = process.env.VUE_APP_BACKEND_HOST+data;
        a.download = data.substr(data.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
    deleteFile(path=""){
      setTimeout(() => axios.post('/remove-file',{
        file_path: path
      }), 5000);
    },
    async saveReport() {
      this.spin = true;
      const data_model = this.getDataModels()
      this.validationNameAndDesc();
      if (this.requiredCheck === false) {
        const {success, message} = await this.saveReportData(this.con_id, this.report_name, this.report_desc, this.query, data_model)
        if (success) {
          toastr.success(message);
        } else {
          toastr.error(message);
        }
      }
      this.spin = false;
    },
    getDataModels() {
      let data_model = []
      if (
        this.mappedTable.length > 0 || 
        this.filters.length > 0 || 
        this.savedJoins.length > 0 || 
        this.group_by.length > 0 || 
        this.sort_by.length > 0
      ) {
        const models = {
          'tables': [...this.mappedTable],
          'filters': [...this.filters], 
          'joins': [...this.savedJoins], 
          'group_by': [...this.group_by], 
          'sort_by': [...this.sort_by]
        }
        data_model = JSON.stringify(models)
      }
      return data_model
    },
    validationNameAndDesc() {
      if(this.report_name === '') {
        this.errorList['report_name'] = 'Report Name is required'
      } else {
        this.errorList['report_name'] = null
      }
    
      if(this.report_desc === '') {
        this.errorList['report_desc'] = 'Report Description is required'
      } else {
        this.errorList['report_desc'] = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* .form-floating > .form-control, .form-floating > .form-select {
    height: calc(3rem + 2px) !important;
} */
.error-message {
  border: 1px solid #ff0000;
  background-color: #ffeeee;
  color: #ff0000;
  padding: 10px;
  margin: 10px;
  width: 300px;
}

.error-message h3 {
  margin-top: 0;
}

.error-message p {
  margin-bottom: 0;
}
</style>